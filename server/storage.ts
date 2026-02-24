import { users, projectRequests, testimonials, type User, type InsertUser, type ProjectRequest, type InsertProjectRequest, type Testimonial, type InsertTestimonial } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createProjectRequest(request: InsertProjectRequest & { generatedPrompt: string }): Promise<ProjectRequest>;
  getProjectRequests(): Promise<ProjectRequest[]>;
  getProjectRequestById(id: string): Promise<ProjectRequest | undefined>;
  updateProjectRequestStatus(id: string, status: string): Promise<ProjectRequest | undefined>;
  deleteProjectRequest(id: string): Promise<boolean>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>;
  updateTestimonialStatus(id: string, status: string): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createProjectRequest(requestData: InsertProjectRequest & { generatedPrompt: string }): Promise<ProjectRequest> {
    const [request] = await db
      .insert(projectRequests)
      .values({
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        email: requestData.email,
        company: requestData.company || "",
        projectType: requestData.projectType,
        budget: requestData.budget,
        budgetRange: requestData.budgetRange || "",
        timeline: requestData.timeline,
        description: requestData.description,
        referenceUrl: requestData.referenceUrl || "",
        targetAudience: requestData.targetAudience || "",
        keyFeatures: requestData.keyFeatures || "",
        techPreferences: requestData.techPreferences || "",
        designReferences: requestData.designReferences || "",
        additionalInfo: requestData.additionalInfo || "",
        generatedPrompt: requestData.generatedPrompt,
        status: 'new',
      })
      .returning();
    return request;
  }

  async getProjectRequests(): Promise<ProjectRequest[]> {
    const requests = await db.select().from(projectRequests).orderBy(desc(projectRequests.createdAt));
    return requests;
  }

  async getProjectRequestById(id: string): Promise<ProjectRequest | undefined> {
    const [request] = await db.select().from(projectRequests).where(eq(projectRequests.id, id));
    return request || undefined;
  }

  async updateProjectRequestStatus(id: string, status: string): Promise<ProjectRequest | undefined> {
    const [updatedRequest] = await db
      .update(projectRequests)
      .set({ status })
      .where(eq(projectRequests.id, id))
      .returning();
    return updatedRequest || undefined;
  }

  async deleteProjectRequest(id: string): Promise<boolean> {
    const result = await db
      .delete(projectRequests)
      .where(eq(projectRequests.id, id));
    return (result.rowCount || 0) > 0;
  }

  async createTestimonial(data: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values({
        name: data.name,
        role: data.role,
        company: data.company || "",
        content: data.content,
        rating: data.rating ?? 5,
        status: 'pending',
      })
      .returning();
    return testimonial;
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.status, 'approved'))
      .orderBy(desc(testimonials.createdAt));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }

  async updateTestimonialStatus(id: string, status: string): Promise<Testimonial | undefined> {
    const [updated] = await db
      .update(testimonials)
      .set({ status })
      .where(eq(testimonials.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
