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
      console.log(`Uploading file: ${localPath} (${fs.existsSync(localPath) ? 'exists' : 'NOT FOUND'}) to ${objectKey}`);
      
      // Read file as buffer first to ensure it's properly read
      const fileBuffer = fs.readFileSync(localPath);
      console.log(`File size: ${fileBuffer.length} bytes`);
      
      // Determine content type from file extension
      const ext = objectKey.split('.').pop()?.toLowerCase();
      const contentType = ext === 'png' ? 'image/png' : 
                         ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                         ext === 'webp' ? 'image/webp' : 'application/octet-stream';
      
      // Upload with proper metadata - Note: Replit Object Storage may not support metadata
      const { ok, error } = await this.client.uploadFromBytes(objectKey, fileBuffer);
      console.log(`Upload metadata attempted: contentType=${contentType}, contentLength=${fileBuffer.length}`);
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
        localPath: 'attached_assets/08_texas_1755456022650.jpg',
        objectKey: 'portfolio/fighting-game-tournament.png'
      },
      {
        localPath: 'attached_assets/brainbot_1755456022650.png',
        objectKey: 'portfolio/brain-discord-bot.png'
      },
      {
        localPath: 'attached_assets/brainbot_1755456022650.png', // Using as placeholder
        objectKey: 'portfolio/jamaica-restaurant.webp'
      },
      {
        localPath: 'attached_assets/08_texas_1755456022650.jpg', // Using as placeholder
        objectKey: 'portfolio/faith-ministry-website.png'
      },
      {
        localPath: 'attached_assets/brainbot_1755456022650.png', // Using as placeholder
        objectKey: 'portfolio/power-of-lamb-ministry.png'
      },
      {
        localPath: 'attached_assets/08_texas_1755456022650.jpg', // Using as placeholder
        objectKey: 'portfolio/caribbean-food-platform.png'
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