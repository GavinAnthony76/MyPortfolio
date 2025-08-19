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
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { sendInternalNotification, sendAutoReply } from "./mailer";
import { getChatResponse, getGreetingMessage } from "./ai-assistant";
import Stripe from "stripe";


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
          "https://ssl.google-analytics.com",
          "https://js.stripe.com",
          "https://r.stripe.com",
          "https://m.stripe.com",
          "https://q.stripe.com"
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
          "https://stats.g.doubleclick.net",
          "https://api.stripe.com",
          "https://r.stripe.com",
          "https://m.stripe.com",
          "https://q.stripe.com"
        ],
        frameSrc: [
          "https://www.googletagmanager.com",
          "https://js.stripe.com",
          "https://hooks.stripe.com"
        ],
        formAction: [
          "'self'",
          "https://api.stripe.com"
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
      console.log('Using PostgreSQL session store for production');
    } else {
      console.log('Using default session store for development');
    }
  } catch (error) {
    console.error('Failed to create PostgreSQL session store:', error);
    console.log('Falling back to default session store');
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
        console.log('Admin user created successfully');
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  };

  await initializeAdmin();

  // Initialize Stripe
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });

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

          console.log(`Project request created with email notifications: ${projectRequest.id}`);
        } else {
          console.log(`Project request created (no email configuration): ${projectRequest.id}`);
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
        jamaicanRestaurant: await storageManager.downloadImageUrl('portfolio/jamaica-restaurant.png'),
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
      'jamaica-restaurant.png': 'attached_assets/jamaica-restaurant.png',
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

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd", service } = req.body;
      
      // Validate amount
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ 
          error: "Invalid amount. Amount must be a positive number." 
        });
      }

      // Validate currency
      const supportedCurrencies = ['usd', 'eur', 'gbp', 'cad', 'aud'];
      if (!supportedCurrencies.includes(currency.toLowerCase())) {
        return res.status(400).json({ 
          error: "Unsupported currency. Supported currencies: " + supportedCurrencies.join(', ')
        });
      }

      // Validate service
      if (!service || typeof service !== 'string') {
        return res.status(400).json({ 
          error: "Service name is required." 
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          service: service,
          created_at: new Date().toISOString(),
          integration: 'gavineanthony_portfolio'
        }
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id 
      });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      
      // Handle specific Stripe errors
      if (error.type === 'StripeCardError') {
        res.status(400).json({ 
          error: "Your card was declined: " + error.message 
        });
      } else if (error.type === 'StripeRateLimitError') {
        res.status(429).json({ 
          error: "Too many requests. Please try again later." 
        });
      } else if (error.type === 'StripeInvalidRequestError') {
        res.status(400).json({ 
          error: "Invalid request: " + error.message 
        });
      } else if (error.type === 'StripeAPIError') {
        res.status(500).json({ 
          error: "API error. Please try again." 
        });
      } else if (error.type === 'StripeConnectionError') {
        res.status(500).json({ 
          error: "Network error. Please check your connection." 
        });
      } else if (error.type === 'StripeAuthenticationError') {
        res.status(500).json({ 
          error: "Authentication error. Please contact support." 
        });
      } else {
        res.status(500).json({ 
          error: "An unexpected error occurred. Please try again." 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
