import { Client } from '@replit/object-storage';
import fs from 'fs';
import path from 'path';

class StorageManager {
  public client: Client | null = null;
  private isAvailable: boolean = false;

  constructor() {
    try {
      this.client = new Client();
      this.isAvailable = true;
      console.log('Object storage configured successfully');
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
      console.warn(`Object storage not available for ${objectKey}`);
      return null;
    }
    
    try {
      if (!this.client) {
        return null;
      }
      // Get download URL from object storage
      const downloadResult = await this.client.downloadAsBytes(objectKey);
      if (downloadResult.ok) {
        // Return the object key path that can be served through our API
        return `/api/storage/${objectKey}`;
      }
      return null;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  }

  async uploadAllPortfolioImages(): Promise<void> {
    if (!this.isAvailable) {
      console.log('Object storage not configured. Images must be uploaded via Replit Object Storage interface.');
      return;
    }

    const imagesToUpload = [
      {
        localPath: 'attached_assets/generated_images/Fighting_game_tournament_interface_75b551f6.png',
        objectKey: 'portfolio/fighting-game-tournament.png'
      },
      {
        localPath: 'attached_assets/generated_images/Caribbean_restaurant_platform_0f22437a.png',
        objectKey: 'portfolio/caribbean-food-platform.png'
      },
      {
        localPath: 'attached_assets/generated_images/Caribbean_restaurant_platform_0f22437a.png',
        objectKey: 'portfolio/jamaica-restaurant.png'
      },
      {
        localPath: 'attached_assets/generated_images/Church_ministry_website_ce445453.png',
        objectKey: 'portfolio/faith-ministry-website.png'
      },
      {
        localPath: 'attached_assets/generated_images/Church_ministry_website_ce445453.png',
        objectKey: 'portfolio/power-of-lamb-ministry.png'
      },
      {
        localPath: 'attached_assets/generated_images/Discord_bot_dashboard_99437552.png',
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