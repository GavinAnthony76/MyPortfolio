import { type User, type InsertUser, type ProjectRequest, type InsertProjectRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createProjectRequest(request: InsertProjectRequest & { generatedPrompt: string }): Promise<ProjectRequest>;
  getProjectRequests(): Promise<ProjectRequest[]>;
  updateProjectRequestStatus(id: string, status: string): Promise<ProjectRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projectRequests: Map<string, ProjectRequest>;

  constructor() {
    this.users = new Map();
    this.projectRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createProjectRequest(requestData: InsertProjectRequest & { generatedPrompt: string }): Promise<ProjectRequest> {
    const id = randomUUID();
    const request: ProjectRequest = {
      id,
      firstName: requestData.firstName,
      lastName: requestData.lastName,
      email: requestData.email,
      company: requestData.company || "",
      projectType: requestData.projectType,
      budget: requestData.budget,
      timeline: requestData.timeline,
      description: requestData.description,
      targetAudience: requestData.targetAudience || "",
      keyFeatures: requestData.keyFeatures || "",
      techPreferences: requestData.techPreferences || "",
      designReferences: requestData.designReferences || "",
      additionalInfo: requestData.additionalInfo || "",
      generatedPrompt: requestData.generatedPrompt,
      status: 'new',
      createdAt: new Date(),
    };
    this.projectRequests.set(id, request);
    return request;
  }

  async getProjectRequests(): Promise<ProjectRequest[]> {
    return Array.from(this.projectRequests.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateProjectRequestStatus(id: string, status: string): Promise<ProjectRequest | undefined> {
    const request = this.projectRequests.get(id);
    if (request) {
      request.status = status;
      this.projectRequests.set(id, request);
      return request;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
