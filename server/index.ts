import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { clerkClient } from "@clerk/express";
import { bootstrapAdminIdentity } from "./auth/adminBootstrap";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app = express();
// Trust the immediate hosting proxy, not arbitrary client-supplied hops.
app.set("trust proxy", 1);

// Security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Production security headers (CSP handled by helmet in routes.ts)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Public pages, assets, and Clerk's proxy must remain reachable. Contact and
// testimonial submissions retain their endpoint-specific abuse protection.

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const listenOptions: Record<string, unknown> = {
    port,
    host: "0.0.0.0",
  };
  // reusePort is unsupported on Windows sockets and throws ENOTSUP
  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }
  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
    // Run after listening so provider latency cannot prevent health checks.
    // This uses the deployment's own managed Clerk credentials, never dev IDs.
    if (process.env.NODE_ENV === "production") {
      void bootstrapAdminIdentity(
        process.env.NODE_ENV,
        process.env.ADMIN_EMAIL,
        {
          find: (email) => clerkClient.users.getUserList({
            emailAddress: [email],
            limit: 2,
          }),
          create: (options) => clerkClient.users.createUser(options),
        },
      ).then((status) => {
        log(`[admin-bootstrap] ${status}`);
        if (status === "existing-needs-review") {
          console.error("[admin-bootstrap] Existing account needs a verified primary email matching ADMIN_EMAIL; no account settings were changed.");
        }
      }).catch(() => {
        // Do not log provider payloads, keys, email addresses, or account IDs.
        console.error("[admin-bootstrap] Failed to establish the configured production admin identity. Dashboard authorization remains enforced.");
      });
    }
  });
})();
