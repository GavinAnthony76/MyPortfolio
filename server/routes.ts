import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertProjectRequestSchema } from "@shared/schema";
import { generateProjectPrompt } from "../client/src/lib/prompt-generator";
import StorageManager from "./storage-manager";
import bcrypt from "bcrypt";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  const storageManager = new StorageManager();

  // Session configuration with persistent storage
  const isProduction = process.env.NODE_ENV === 'production';
  const PostgresqlStore = pgSession(session);
  
  // Create session store with PostgreSQL
  const sessionStore = new PostgresqlStore({
    // Use the existing database connection
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false
    },
    tableName: 'user_sessions', // Store sessions in separate table
    createTableIfMissing: true, // Auto-create session table
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production-12345',
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Use PostgreSQL session store
    name: 'auth_session', // Distinctive session name
    cookie: {
      secure: isProduction, // Secure cookies in production
      httpOnly: true, // Prevent XSS access to cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days instead of 24 hours
      sameSite: isProduction ? 'none' : 'lax', // Cross-site compatibility for production
      domain: isProduction ? '.gavineanthony.com' : undefined, // Domain-wide cookies for production
    },
    rolling: true, // Extend session on activity
  }));

  // Enhanced authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - No session' });
      }
      
      // Verify user still exists in database
      const user = await storage.getUser(userId);
      if (!user) {
        // User doesn't exist, destroy invalid session
        req.session.destroy((err: any) => {
          if (err) console.error('Session destroy error:', err);
        });
        return res.status(401).json({ message: 'Unauthorized - Invalid user' });
      }
      
      // Extend session on activity
      req.session.touch();
      
      // Add user info to request for use in handlers
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({ message: 'Authentication error' });
    }
  };

  // Create admin user if doesn't exist
  const initializeAdmin = async () => {
    try {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminPassword) {
        console.error('ADMIN_PASSWORD environment variable is required');
        return;
      }
      
      const existingAdmin = await storage.getUserByUsername(adminUsername);
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await storage.createUser({
          username: adminUsername,
          password: hashedPassword
        });
        console.log('Admin user created successfully');
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  };

  await initializeAdmin();

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Login attempt for username:', username);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log('User not found:', username);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', username);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Set session data
      (req.session as any).userId = user.id;
      (req.session as any).username = user.username;
      (req.session as any).loginTime = new Date().toISOString();
      
      // Save session explicitly and regenerate session ID for security
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.status(500).json({ message: 'Session error' });
        }
        
        // Re-set session data after regeneration
        (req.session as any).userId = user.id;
        (req.session as any).username = user.username;
        (req.session as any).loginTime = new Date().toISOString();
        
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return res.status(500).json({ message: 'Session error' });
          }
          console.log('Login successful for user:', username, 'Session ID:', req.session.id);
          res.json({ 
            success: true, 
            message: 'Login successful',
            sessionId: req.session.id 
          });
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });

  // Check auth status
  app.get('/api/auth/status', async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const username = (req.session as any).username;
      const loginTime = (req.session as any).loginTime;
      
      console.log('Auth status check - Session ID:', req.session.id, 'User ID:', userId);
      
      if (userId) {
        // Verify user still exists in database
        const user = await storage.getUser(userId);
        if (user) {
          // Touch session to extend expiration
          req.session.touch();
          res.json({ 
            authenticated: true,
            sessionId: req.session.id,
            username: username,
            loginTime: loginTime
          });
        } else {
          // User doesn't exist anymore, destroy session
          req.session.destroy((err) => {
            if (err) console.error('Session destroy error:', err);
          });
          res.json({ authenticated: false, reason: 'user_not_found' });
        }
      } else {
        res.json({ authenticated: false, reason: 'no_session' });
      }
    } catch (error) {
      console.error('Auth status error:', error);
      res.json({ authenticated: false, reason: 'server_error' });
    }
  });
  // Submit project request
  app.post("/api/project-requests", async (req, res) => {
    try {
      const validatedData = insertProjectRequestSchema.parse(req.body);
      
      // Generate detailed prompt from form data
      const generatedPrompt = generateProjectPrompt(validatedData);
      
      const projectRequest = await storage.createProjectRequest({
        ...validatedData,
        generatedPrompt,
      });
      
      res.json({ success: true, id: projectRequest.id });
    } catch (error) {
      console.error("Error creating project request:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid request data" 
      });
    }
  });

  // Get all project requests (for developer dashboard) - Protected
  app.get("/api/project-requests", requireAuth, async (req, res) => {
    try {
      const requests = await storage.getProjectRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching project requests:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch project requests" 
      });
    }
  });

  // Update project request status - Protected
  app.patch("/api/project-requests/:id/status", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['new', 'responded', 'proposal-sent', 'follow-up', 'in-progress', 'complete', 'won', 'lost', 'archived'].includes(status)) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid status" 
        });
      }
      
      const updatedRequest = await storage.updateProjectRequestStatus(id, status);
      
      if (!updatedRequest) {
        return res.status(404).json({ 
          success: false, 
          error: "Project request not found" 
        });
      }
      
      res.json({ success: true, request: updatedRequest });
    } catch (error) {
      console.error("Error updating project request:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to update project request" 
      });
    }
  });

  // Upload portfolio images to object storage
  app.post("/api/upload-images", async (req, res) => {
    try {
      console.log("Starting portfolio images upload...");
      await storageManager.uploadAllPortfolioImages();
      res.json({ success: true, message: "All portfolio images uploaded successfully" });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to upload images" 
      });
    }
  });

  // Get image URLs from object storage
  app.get("/api/images", async (req, res) => {
    try {
      const images = {
        fightingGame: await storageManager.downloadImageUrl('portfolio/fighting-game-tournament.png'),
        caribbeanFood: await storageManager.downloadImageUrl('portfolio/caribbean-food-platform.png'),
        jamaicaRestaurant: await storageManager.downloadImageUrl('portfolio/jamaica-restaurant.webp'),
        faithMinistry: await storageManager.downloadImageUrl('portfolio/faith-ministry-website.png'),
        powerOfLamb: await storageManager.downloadImageUrl('portfolio/power-of-lamb-ministry.png'),
        brainBot: await storageManager.downloadImageUrl('portfolio/brain-discord-bot.png'),
      };
      res.json(images);
    } catch (error) {
      console.error("Error getting image URLs:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to get image URLs" 
      });
    }
  });

  // List all objects in storage (for debugging)
  app.get("/api/storage/list", async (req, res) => {
    try {
      const objects = await storageManager.listAllObjects();
      res.json({ objects });
    } catch (error) {
      console.error("Error listing objects:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to list objects" 
      });
    }
  });

  // Serve local assets as fallback when object storage is not configured
  app.get("/api/assets/:filename", (req, res) => {
    const { filename } = req.params;
    const assetMap: Record<string, string> = {
      'fighting-game-tournament.png': 'attached_assets/generated_images/Fighting_Game_Tournament_b38218ec.png',
      'caribbean-food-platform.png': 'attached_assets/generated_images/Caribbean_Food_Platform_720bc623.png',
      'jamaica-restaurant.webp': 'attached_assets/9ba9ffab5f885fc3dac87838b3357014_1754763209553_1755130520942.webp',
      'faith-ministry-website.png': 'attached_assets/generated_images/Spiritual_Church_Website_24ec815c.png',
      'power-of-lamb-ministry.png': 'attached_assets/generated_images/Power_of_Lamb_Ministry_db0032ce.png',
      'brain-discord-bot.png': 'attached_assets/generated_images/Brain_Discord_Bot_4745ca5a.png',
    };

    const filePath = assetMap[filename];
    if (filePath) {
      // Set cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('ETag', `"${filename}"`);
      res.sendFile(filePath, { root: process.cwd() });
    } else {
      res.status(404).json({ error: 'Asset not found' });
    }
  });

  // Serve robots.txt
  app.get("/robots.txt", (req, res) => {
    const robotsPath = path.join(process.cwd(), "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.type('text/plain');
      res.sendFile(robotsPath);
    } else {
      res.type('text/plain').send(`User-agent: *
Allow: /

Sitemap: https://www.gavineanthony.com/sitemap.xml

User-agent: *
Disallow: /dashboard
Disallow: /login
Disallow: /api/`);
    }
  });

  // Basic sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.gavineanthony.com</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.gavineanthony.com/#about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.gavineanthony.com/#services</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.gavineanthony.com/#projects</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.gavineanthony.com/#contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.9</priority>
  </url>
</urlset>`;
    res.type('application/xml');
    res.send(sitemap);
  });

  const httpServer = createServer(app);
  return httpServer;
}
