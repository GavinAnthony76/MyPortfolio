import { Client } from '@replit/object-storage';
import fs from 'fs';
import path from 'path';

class StorageManager {
  private client: Client | null = null;
  private isAvailable: boolean = false;

  constructor() {
    try {
      // Don't instantiate client immediately - wait for proper bucket configuration
      this.isAvailable = false;
      console.log('Object storage not configured, using local asset serving');
    } catch (error) {
      console.warn('Replit Object Storage not configured. Using local fallback.');
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
      const { ok, error } = await this.client.uploadFromFilename(objectKey, localPath);
      return { ok, error };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async downloadImageUrl(objectKey: string): Promise<string | null> {
    if (!this.isAvailable) {
      // Return fallback to local assets for development
      const fallbackMap: Record<string, string> = {
        'portfolio/fighting-game-tournament.png': '/api/assets/fighting-game-tournament.png',
        'portfolio/caribbean-food-platform.png': '/api/assets/jamaica-restaurant.png',
        'portfolio/jamaica-restaurant.webp': '/api/assets/jamaica-restaurant.png',
        'portfolio/jamaica-restaurant.png': '/api/assets/jamaica-restaurant.png',
        'portfolio/faith-ministry-website.png': '/api/assets/faith-ministry-website.png',
        'portfolio/power-of-lamb-ministry.png': '/api/assets/power-of-lamb-ministry.png',
        'portfolio/brain-discord-bot.png': '/api/assets/brain-discord-bot.png',
      };
      return fallbackMap[objectKey] || null;
    }
    
    try {
      // For Replit Object Storage, we can construct a public URL
      // The actual URL structure will depend on your bucket configuration
      return `https://storage.replit.com/${objectKey}`;
    } catch (error) {
      console.error('Error constructing image URL:', error);
      return null;
    }
  }

  async uploadAllPortfolioImages(): Promise<void> {
    if (!this.isAvailable) {
      console.log('Object storage not available, serving from local assets');
      return;
    }

    const imagesToUpload = [
      {
        localPath: 'attached_assets/generated_images/Fighting_Game_Tournament_b38218ec.png',
        objectKey: 'portfolio/fighting-game-tournament.png'
      },
      {
        localPath: 'attached_assets/generated_images/Caribbean_Food_Platform_720bc623.png',
        objectKey: 'portfolio/caribbean-food-platform.png'
      },
      {
        localPath: 'attached_assets/9ba9ffab5f885fc3dac87838b3357014_1754763209553_1755130520942.webp',
        objectKey: 'portfolio/jamaica-restaurant.webp'
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