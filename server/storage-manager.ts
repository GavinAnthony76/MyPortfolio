import { Client } from '@replit/object-storage';
import fs from 'fs';
import path from 'path';

class StorageManager {
  private client: Client | null = null;
  private isAvailable: boolean = false;

  constructor() {
    // Object storage initialization disabled for now due to configuration issues
    // Will be enabled when deployed to production environment
    this.isAvailable = false;
    this.client = null;
    console.log('Object storage temporarily disabled - images will be uploaded on deployment');
  }

  async initializeClient(): Promise<void> {
    try {
      // Check if environment variables are available
      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
      const publicPaths = process.env.PUBLIC_OBJECT_SEARCH_PATHS;
      const privatePath = process.env.PRIVATE_OBJECT_DIR;
      
      if (bucketId && publicPaths && privatePath) {
        this.client = new Client();
        this.isAvailable = true;
        console.log('Object storage initialized successfully');
      }
    } catch (error) {
      console.warn('Object storage initialization failed:', error);
      this.isAvailable = false;
    }
  }

  async uploadImage(localPath: string, objectKey: string): Promise<{ ok: boolean; error?: any }> {
    if (!this.isAvailable) {
      return { ok: false, error: 'Object storage not available' };
    }
    
    try {
      if (!this.client) {
        return { ok: false, error: 'Client not initialized' };
      }
      const { ok, error } = await this.client.uploadFromFilename(`public/${objectKey}`, localPath);
      return { ok, error };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async downloadImageUrl(objectKey: string): Promise<string | null> {
    if (!this.isAvailable || !this.client) {
      // Object storage not available - no fallback since we removed local assets
      return null;
    }
    
    try {
      // For public objects, construct the public URL using the bucket name from env vars
      const publicSearchPaths = process.env.PUBLIC_OBJECT_SEARCH_PATHS;
      if (publicSearchPaths) {
        // Extract bucket name from the public search path
        const bucketName = publicSearchPaths.split('/')[1];
        return `https://storage.googleapis.com/${bucketName}/public/${objectKey}`;
      }
      return null;
    } catch (error) {
      console.error('Error constructing image URL:', error);
      return null;
    }
  }

  async uploadAllPortfolioImages(): Promise<void> {
    // Try to initialize client if not already done
    if (!this.isAvailable) {
      await this.initializeClient();
    }
    
    if (!this.isAvailable || !this.client) {
      console.log('Object storage not available - images will be uploaded on deployment');
      return;
    }

    const imagesToUpload = [
      // Portfolio project images
      {
        localPath: 'attached_assets/generated_images/Fighting_Game_Tournament_b38218ec.png',
        objectKey: 'portfolio/fighting-game-tournament.png'
      },
      {
        localPath: 'attached_assets/generated_images/Caribbean_Food_Platform_720bc623.png',
        objectKey: 'portfolio/caribbean-food-platform.png'
      },
      {
        localPath: 'attached_assets/generated_images/Spiritual_Church_Website_24ec815c.png',
        objectKey: 'portfolio/faith-ministry-website.png'
      },
      {
        localPath: 'attached_assets/generated_images/Power_of_Lamb_Ministry_db0032ce.png',
        objectKey: 'portfolio/power-of-lamb-ministry.png'
      },
      {
        localPath: 'attached_assets/generated_images/Brain_Discord_Bot_4745ca5a.png',
        objectKey: 'portfolio/brain-discord-bot.png'
      },
      // Developer profile and site images
      {
        localPath: 'attached_assets/generated_images/Professional_Black_developer_coding_374d8a1b.png',
        objectKey: 'site/developer-profile.png'
      },
      {
        localPath: 'attached_assets/image_1755150211124.png',
        objectKey: 'site/contact-waiting.png'
      }
    ];

    for (const image of imagesToUpload) {
      if (fs.existsSync(image.localPath)) {
        console.log(`Uploading ${image.localPath} to ${image.objectKey}...`);
        const result = await this.uploadImage(image.localPath, image.objectKey);
        if (result.ok) {
          console.log(`✓ Successfully uploaded ${image.objectKey}`);
        } else {
          console.error(`✗ Failed to upload ${image.objectKey}:`, result.error);
        }
      } else {
        console.warn(`⚠ File not found: ${image.localPath}`);
      }
    }
  }

  async listAllObjects(): Promise<any[]> {
    if (!this.isAvailable) {
      return [];
    }
    
    try {
      if (!this.client) {
        return [];
      }
      const { ok, value: objects, error } = await this.client.list();
      if (ok && objects) {
        return objects;
      }
      console.error('Error listing objects:', error);
      return [];
    } catch (error) {
      console.error('Error listing objects:', error);
      return [];
    }
  }
}

export default StorageManager;