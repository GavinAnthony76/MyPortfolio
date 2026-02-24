import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projectRequests = pgTable("project_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company").default(""),
  projectType: text("project_type").notNull(),
  budget: text("budget").default(""),
  budgetRange: text("budget_range").default(""),
  timeline: text("timeline").notNull(),
  description: text("description").notNull(),
  referenceUrl: text("reference_url").default(""),
  targetAudience: text("target_audience").default(""),
  keyFeatures: text("key_features").default(""),
  techPreferences: text("tech_preferences").default(""),
  designReferences: text("design_references").default(""),
  additionalInfo: text("additional_info").default(""),
  generatedPrompt: text("generated_prompt").notNull(),
  status: text("status").notNull().default('new'), // new, responded, proposal-sent, follow-up, in-progress, complete, won, lost, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSessions = pgTable("user_sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectRequestSchema = createInsertSchema(projectRequests).omit({
  id: true,
  generatedPrompt: true,
  status: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProjectRequest = z.infer<typeof insertProjectRequestSchema>;
export type ProjectRequest = typeof projectRequests.$inferSelect;
