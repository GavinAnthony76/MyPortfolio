import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectRequestSchema } from "@shared/schema";
import { generateProjectPrompt } from "../client/src/lib/prompt-generator";
import StorageManager from "./storage-manager";

export async function registerRoutes(app: Express): Promise<Server> {
  const storageManager = new StorageManager();
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

  // Get all project requests (for developer dashboard)
  app.get("/api/project-requests", async (req, res) => {
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

  // Update project request status
  app.patch("/api/project-requests/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['new', 'in-review', 'archived'].includes(status)) {
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
    };

    const filePath = assetMap[filename];
    if (filePath) {
      res.sendFile(filePath, { root: process.cwd() });
    } else {
      res.status(404).json({ error: 'Asset not found' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
