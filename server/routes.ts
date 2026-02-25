import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertProjectRequestSchema, insertTestimonialSchema } from "@shared/schema";
import { generateProjectPrompt } from "../client/src/lib/prompt-generator";
import StorageManager from "./storage-manager";
import bcrypt from "bcrypt";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { db } from "./db";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { sendInternalNotification, sendAutoReply } from "./mailer";
import { getChatResponse, getGreetingMessage } from "./ai-assistant";


export async function registerRoutes(app: Express): Promise<Server> {
  const storageManager = new StorageManager();

  // Add security middleware with Google Tag Manager support
  app.use(helmet({
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    contentSecurityPolicy: process.env.NODE_ENV === 'development' ? false : {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "https://fonts.googleapis.com",
          "https://www.googletagmanager.com",
          "https://ssl.google-analytics.com"
        ],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com"
        ],
        fontSrc: [
          "'self'", 
          "https://fonts.gstatic.com"
        ],
        imgSrc: [
          "'self'", 
          "data:", 
          "https:",
          "https://www.google-analytics.com",
          "https://ssl.google-analytics.com"
        ],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://ssl.google-analytics.com",
          "https://stats.g.doubleclick.net"
        ],
        frameSrc: [
          "https://www.googletagmanager.com"
        ],
        formAction: [
          "'self'"
        ]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // Rate limiting for contact form
  const contactLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per windowMs for contact form
    message: { error: "Too many contact requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use X-Forwarded-For header if available, otherwise fall back to connection IP
      return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
             req.socket.remoteAddress || 
             'unknown';
    }
  });

  // Session configuration with persistent storage
  const isProduction = process.env.NODE_ENV === 'production';
  let sessionStore;
  
  try {
    if (process.env.DATABASE_URL && isProduction) {
      const PostgresqlStore = pgSession(session);
      
      // Create session store with PostgreSQL
      sessionStore = new PostgresqlStore({
        conObject: {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        },
        tableName: 'user_sessions',
        createTableIfMissing: true,
      });

    } else {

    }
  } catch (error) {
    console.error('Failed to create PostgreSQL session store:', error);

  }

  // Trust proxy for proper IP/cookie handling in production
  if (isProduction) {
    app.set('trust proxy', 1);
  }

  // Canonical host redirection for production
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      const host = req.headers.host || '';
      // choose one canonical host; here I use "www"
      if (host === 'gavineanthony.com') {
        return res.redirect(301, `https://www.gavineanthony.com${req.originalUrl}`);
      }
    }
    next();
  });

  const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production-12345',
    resave: false,
    saveUninitialized: false,
    name: 'auth_session',
    cookie: {
      secure: isProduction,          // requires HTTPS
      httpOnly: true,
      sameSite: 'none' as const,     // cross-site safe
      domain: isProduction ? '.gavineanthony.com' : undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    },
    rolling: true,
    proxy: isProduction, // Trust proxy in production
  };

  if (sessionStore) {
    (sessionConfig as any).store = sessionStore;
  }

  app.use(session(sessionConfig));

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

      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  };

  await initializeAdmin();

  // No-cache middleware for auth endpoints
  const noCache = (_req: any, res: any, next: any) => {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache", 
      "Expires": "0",
      "Vary": "Cookie"
    });
    next();
  };

  // Login endpoint
  app.post('/api/login', noCache, async (req, res) => {
    try {
      const { username, password } = req.body;

      
      const user = await storage.getUserByUsername(username);
      if (!user) {

        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {

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
  app.post('/api/logout', noCache, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });

  // Check auth status
  app.get('/api/auth/status', noCache, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const username = (req.session as any).username;
      const loginTime = (req.session as any).loginTime;
      

      
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
  // Submit project request with email notifications
  app.post("/api/project-requests", contactLimiter, async (req, res) => {
    try {
      const validatedData = insertProjectRequestSchema.parse(req.body);
      
      // Generate detailed prompt from form data
      const generatedPrompt = generateProjectPrompt(validatedData);
      
      const projectRequest = await storage.createProjectRequest({
        ...validatedData,
        generatedPrompt,
      });
      
      // Send email notifications if SMTP is configured
      try {
        const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER;
        const INTERNAL_TO = process.env.INTERNAL_TO;
        const REPLY_TO = process.env.REPLY_TO || FROM_EMAIL;

        if (FROM_EMAIL && INTERNAL_TO && process.env.SMTP_USER && process.env.SMTP_PASS) {
          // Send internal notification
          await sendInternalNotification(INTERNAL_TO, FROM_EMAIL, {
            name: `${validatedData.firstName} ${validatedData.lastName}`,
            email: validatedData.email,
            company: validatedData.company || "",
            projectType: validatedData.projectType,
            timeline: validatedData.timeline,
            description: validatedData.description,
            generatedPrompt: generatedPrompt
          });

          // Send auto-reply to client
          await sendAutoReply(
            validatedData.email,
            FROM_EMAIL,
            validatedData.firstName,
            REPLY_TO
          );


        } else {

        }
      } catch (emailError) {
        console.error("Email notification failed (request still saved):", emailError);
        // Continue - don't fail the request if email fails
      }
      
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

  // Delete project request - Protected
  app.delete("/api/project-requests/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteProjectRequest(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          error: "Project request not found" 
        });
      }
      
      res.json({ success: true, message: "Project request deleted successfully" });
    } catch (error) {
      console.error("Error deleting project request:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to delete project request" 
      });
    }
  });

  // Public project status lookup by ticket number (project ID)
  app.get("/api/project-status/:ticketNumber", async (req, res) => {
    try {
      const { ticketNumber } = req.params;
      
      if (!ticketNumber || ticketNumber.length < 10) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid ticket number format" 
        });
      }
      
      const request = await storage.getProjectRequestById(ticketNumber);
      
      if (!request) {
        return res.status(404).json({ 
          success: false, 
          error: "No project found with that ticket number" 
        });
      }
      
      const statusLabels: Record<string, string> = {
        'new': 'Received',
        'responded': 'In Review',
        'proposal-sent': 'Proposal Sent',
        'follow-up': 'Follow Up',
        'in-progress': 'In Development',
        'complete': 'Completed',
        'won': 'Completed',
        'lost': 'Closed',
        'archived': 'Archived',
      };
      
      res.json({ 
        success: true,
        ticketNumber: request.id,
        status: statusLabels[request.status] || request.status,
        projectType: request.projectType,
        submittedAt: request.createdAt,
      });
    } catch (error) {
      console.error("Error looking up project status:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to look up project status" 
      });
    }
  });

  // === TESTIMONIAL ROUTES ===

  const testimonialLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { success: false, error: "Too many submissions. Please try again later." }
  });

  app.get("/api/testimonials", async (_req, res) => {
    try {
      const approved = await storage.getApprovedTestimonials();
      res.json(approved);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ success: false, error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", testimonialLimiter, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(parsed);

      const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER;
      const INTERNAL_TO = process.env.INTERNAL_TO;
      if (FROM_EMAIL && INTERNAL_TO && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          await sendInternalNotification(INTERNAL_TO, FROM_EMAIL, {
            Type: "New Testimonial Submission",
            Name: parsed.name,
            Role: parsed.role,
            Company: parsed.company || "N/A",
            Rating: String(parsed.rating ?? 5),
            Content: parsed.content,
            Note: "Log in to the dashboard to approve or reject this testimonial.",
          });
        } catch (emailError) {
          console.error("Failed to send testimonial notification email:", emailError);
        }
      }

      res.status(201).json({ success: true, message: "Thank you! Your testimonial has been submitted for review." });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, error: "Invalid testimonial data", details: error.errors });
      }
      console.error("Error creating testimonial:", error);
      res.status(500).json({ success: false, error: "Failed to submit testimonial" });
    }
  });

  app.get("/api/admin/testimonials", requireAuth, async (_req, res) => {
    try {
      const all = await storage.getAllTestimonials();
      res.json(all);
    } catch (error) {
      console.error("Error fetching all testimonials:", error);
      res.status(500).json({ success: false, error: "Failed to fetch testimonials" });
    }
  });

  app.patch("/api/admin/testimonials/:id/status", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }
      const updated = await storage.updateTestimonialStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Testimonial not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating testimonial status:", error);
      res.status(500).json({ success: false, error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTestimonial(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Testimonial not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ success: false, error: "Failed to delete testimonial" });
    }
  });

  // Upload portfolio images to object storage
  app.post("/api/upload-images", async (req, res) => {
    try {

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
        jamaicanRestaurant: await storageManager.downloadImageUrl('portfolio/jamaica-restaurant.png'),
        faithMinistry: await storageManager.downloadImageUrl('portfolio/faith-ministry-website.png'),
        powerOfLamb: await storageManager.downloadImageUrl('portfolio/power-of-lamb-ministry.png'),
        shapeTapDeluxe: await storageManager.downloadImageUrl('portfolio/shape-tap-deluxe.png'),
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
      'jamaica-restaurant.png': 'attached_assets/jamaica-restaurant.png',
      'faith-ministry-website.png': 'attached_assets/generated_images/Spiritual_Church_Website_24ec815c.png',
      'power-of-lamb-ministry.png': 'attached_assets/generated_images/Power_of_Lamb_Ministry_db0032ce.png',
      'shape-tap-deluxe.png': 'attached_assets/shape-tap-deluxe.png',
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

  // Serve favicon
  app.get("/favicon.png", (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile('client/public/favicon.png', { root: process.cwd() });
  });

  // AI Assistant endpoints
  app.get('/api/ai/greeting', (req, res) => {
    try {
      const greeting = getGreetingMessage();
      res.json({ message: greeting });
    } catch (error) {
      console.error('Greeting error:', error);
      res.status(500).json({ error: 'Failed to generate greeting' });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Limit conversation history to last 10 messages to manage token usage
      const limitedHistory = conversationHistory.slice(-10);
      
      const response = await getChatResponse(message, limitedHistory);
      res.json(response);
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        success: false, 
        message: "I'm experiencing technical difficulties. Please contact support@gavineanthony.com for technical assistance." 
      });
    }
  });

  app.post('/api/host/ask', (req, res) => {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const q = question.toLowerCase();
    let answer = 'I can help you navigate the site. Use the action buttons to explore projects, testimonials, or start a project.';

    if (q.includes('project') && (q.includes('start') || q.includes('begin') || q.includes('build'))) {
      answer = 'You can start a project by filling out the contact form. Scroll down to the "Start Your Project" section or click the action chip below.';
    } else if (q.includes('portfolio') || q.includes('work') || q.includes('project')) {
      answer = 'The Projects section showcases completed work. Click any card to see the full case study with problem, solution, and results.';
    } else if (q.includes('testimonial') || q.includes('review') || q.includes('feedback')) {
      answer = 'Client testimonials are in the Testimonials section. You can also leave your own testimonial there.';
    } else if (q.includes('status') || q.includes('ticket') || q.includes('track')) {
      answer = 'Use the Project Status section to look up your project by ticket number. You received a ticket number when you submitted your project request.';
    } else if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
      answer = 'You can reach Gavin at gavin@gavineanthony.com or fill out the project request form in the Contact section.';
    } else if (q.includes('price') || q.includes('cost') || q.includes('budget') || q.includes('rate')) {
      answer = 'Pricing depends on the project scope. Fill out the contact form with your details and budget range to get a custom quote.';
    } else if (q.includes('tech') || q.includes('stack') || q.includes('built')) {
      answer = 'Gavin works with React, TypeScript, Node.js, PostgreSQL, and modern web technologies. Check the Projects section for specific examples.';
    }

    res.json({ answer });
  });

  const httpServer = createServer(app);
  return httpServer;
}
