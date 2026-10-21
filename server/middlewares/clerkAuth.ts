import { clerkClient, getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "express";
import { db } from "../db";
import { users } from "@shared/schema";

type ClerkSessionClaims = {
  userId?: string;
  username?: string;
};

// Read-only authorization check, shared by the UI's access probe and all
// privileged API handlers. Never provisions an application user.
export const requireAdminAccess: RequestHandler = async (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail) {
      console.error("ADMIN_EMAIL is not configured");
      return res.status(503).json({ message: "Dashboard authorization is not configured" });
    }
    const clerkUser = await clerkClient.users.getUser(auth.userId);
    const email = clerkUser.primaryEmailAddress;
    if (
      email?.emailAddress.trim().toLowerCase() !== adminEmail ||
      email.verification?.status !== "verified"
    ) {
      return res.status(403).json({ message: "Dashboard administrator access is required" });
    }
    res.locals.adminIdentity = { auth, clerkUser, primaryEmail: email.emailAddress.toLowerCase() };
    next();
  } catch (error) {
    console.error("Clerk authorization check failed:", error);
    return res.status(503).json({ message: "Unable to check dashboard access" });
  }
};

/**
 * Require an administrator's verified Clerk session and resolve the local user row.
 *
 * The local users table remains the bridge for application data. Clerk's
 * sessionClaims.userId preserves the old identity for migrated users. Native
 * Clerk user IDs are used for new sessions that do not carry that legacy claim.
 */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  await requireAdminAccess(req, res, async () => {
   try {
    const { auth, clerkUser, primaryEmail } = res.locals.adminIdentity;
    const claims = auth.sessionClaims as ClerkSessionClaims | undefined;

    const userId = claims?.userId || auth.userId;

    let [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser) {
      const identity =
        claims?.username ||
        clerkUser.username ||
        primaryEmail?.split("@")[0] ||
        "user";
      const username = `${identity}-${userId.slice(-8)}`;
      const [inserted] = await db
        .insert(users)
        .values({
          id: userId,
          username,
          password: "clerk-managed",
        })
        .onConflictDoNothing()
        .returning();

      dbUser = inserted;
      if (!dbUser) {
        [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
      }
    }

    if (!dbUser) {
      return res.status(403).json({ message: "Unable to provision local user" });
    }

    (req as any).dbUser = dbUser;
    next();
  } catch (error) {
    console.error("Clerk auth middleware error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
  });
};