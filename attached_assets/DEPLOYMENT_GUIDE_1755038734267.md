# TX Showdown - Azure Deployment Guide

## Overview
This guide explains how to deploy the redesigned TX Showdown website to Azure, replacing your current site with this modern version.

## What You're Getting
- **Modern React-based website** with glassy portal aesthetic
- **Authentic content** from original txshowdown.com
- **20 authentic fighting games** with official logos from your CDN
- **Mobile-optimized navigation** and responsive design
- **Database-driven content** with PostgreSQL backend
- **Fast performance**: Only 536KB total, 141KB compressed

## Deployment Options for Azure

### Option 1: Azure Static Web Apps (Recommended)
Best for static sites with API functions.

**Steps:**
1. Push code to GitHub repository
2. Connect Azure Static Web Apps to your GitHub repo
3. Configure build settings:
   - Build command: `npm run build`
   - App location: `/`
   - Output location: `dist/public`
4. Set environment variables in Azure portal

### Option 2: Azure App Service
Best for full-stack applications with database.

**Steps:**
1. Create Azure App Service (Node.js runtime)
2. Deploy via Git, GitHub Actions, or ZIP file
3. Configure database connection
4. Set environment variables

### Option 3: Azure Container Instances
For containerized deployment.

## Required Environment Variables
Set these in your Azure deployment:

```
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
PORT=80
```

## Database Setup
1. Create Azure Database for PostgreSQL
2. Run migration: `npm run db:push`
3. Import game data (already included in codebase)

## Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## File Structure for Deployment
```
dist/
├── public/           # Static frontend files
│   ├── index.html
│   ├── assets/
│   └── ...
├── index.js         # Server bundle
└── package.json     # Production dependencies
```

## DNS and Domain Setup
1. Point your domain to Azure deployment
2. Configure SSL certificate in Azure
3. Update any CDN or caching settings

## Performance Optimizations Included
- Gzipped assets (70KB CSS → 12KB, 457KB JS → 127KB)
- Optimized images and lazy loading
- Minimal JavaScript bundle
- Efficient CSS with Tailwind

## Backup Your Current Site
Before deployment:
1. Export current database
2. Download current website files
3. Document current Azure configuration

## Post-Deployment Checklist
- [ ] Verify all pages load correctly
- [ ] Test mobile navigation
- [ ] Confirm game data displays properly
- [ ] Check form submissions work
- [ ] Validate social media links
- [ ] Test search functionality

## Support
- Built with modern React + Express stack
- Includes comprehensive error handling
- Mobile-first responsive design
- Authentic Texas Showdown branding and content

## Technical Details
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, PostgreSQL, Drizzle ORM
- **Build**: Vite (frontend), esbuild (backend)
- **Size**: 536KB total, 141KB compressed
- **Browser Support**: All modern browsers