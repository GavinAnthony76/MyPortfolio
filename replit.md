# Overview

This is a professional portfolio website for a full-stack developer named Gavin Anthony, featuring both a public-facing portfolio site and an internal project request management system. The application serves as both a marketing tool to showcase web development skills and services, and a business tool to collect and manage client inquiries.

The portfolio includes sections for personal introduction, featured projects (focused on web applications, landing pages, and e-commerce), service offerings (web development, responsive design, e-commerce, consulting, maintenance, and MVP development), and a comprehensive contact form. The contact form generates detailed project briefs that are stored in a database and can be managed through an administrative dashboard.

## Recent Changes (August 17, 2025)

### Code Cleanup and Service Updates (COMPLETED ✅)
- **Removed phone number** - cleaned up contact section and all project files
- **Service restructure** - replaced PWA with Website Redesign ($850-$1,200) as most affordable option
- **Code cleanup** - removed backup/broken files, cleaned build artifacts
- **Session schema** - added user_sessions table back to schema for proper authentication
- **Production build** - verified clean build with no LSP errors
- **Ready for redeployment** - all latest updates integrated and tested

### Previous: Professional Email System Integration (COMPLETED ✅)
- **SMTP Email Service** - integrated Namecheap Private Email with Nodemailer for reliable email delivery
- **Automatic client confirmations** - professional HTML emails sent to clients acknowledging project requests
- **Internal notifications** - detailed project summaries sent to projects@gavineanthony.com for every submission
- **Rate limiting** - contact form protected with 5 requests per 10 minutes per IP address
- **Security enhancements** - added Helmet middleware for improved security headers
- **Graceful error handling** - contact form continues working even if email delivery fails
- **Professional email templates** - branded confirmation emails with proper HTML formatting
- **Environment variable configuration** - all email settings configured in Replit Secrets
- **Testing verified** - multiple successful project requests with email delivery confirmed

## Previous Recent Changes (August 14, 2025)

### Production Deployment and Backup Complete (August 16, 2025)
- **Security enhancement** - implemented secure cookie configuration for production HTTPS (secure: isProduction)
- **Jamaica restaurant project updated** - replaced placeholder with authentic Jamaica Nyammingz logo and branding
- **Asset management improved** - updated image serving system with proper PNG format and correct file references
- **SEO metadata corrected** - updated structured data email to projects@gavineanthony.com for consistency
- **Application backup updated** - comprehensive BACKUP_INFO.md with latest deployment status and security fixes
- **Authentication system fixed** - resolved production login issues with session configuration
- **File cleanup completed** - removed broken/unnecessary files including build logs, cookies.txt, and old asset files
- **Asset organization** - cleaned up attached_assets directory, keeping only relevant project screenshots
- **Database cleanup completed** - removed all development/test data (6 test entries purged)
- **Production database ready** - contains only legitimate project requests from real clients
- **Secret management verified** - all required secrets (ADMIN_PASSWORD, DATABASE_URL) properly configured in Replit Secrets
- **Email system fully updated** - all templates and notifications use projects@gavineanthony.com consistently
- **Enhanced .env.example documentation** - added  configuration for future deployments
- **Deployment checklist created** - comprehensive pre/post-deployment validation guide

## Previous Recent Changes

### Production Deployment Success
- **Successfully deployed to www.gavineanthony.com** - custom domain fully operational with SSL/TLS
- **Resolved authentication issues** - dashboard login now working correctly in production environment
- **Implemented secure credential management** - all admin credentials moved to environment variables with bcrypt hashing
- **DNS configuration completed** - proper A record and TXT record setup with Namecheap for custom domain
- **Production security hardening** - comprehensive security headers, session management, and CSRF protection active
- **Environment variable security** - removed all hardcoded credentials, implemented secure ADMIN_PASSWORD system
- **Authentication system verified** - login, session management, and dashboard access fully functional

### Security Enhancements
- **Created SECURITY.md** - comprehensive security guidelines and best practices documentation
- **Environment-based authentication** - admin credentials managed through secure environment variables
- **Password encryption** - bcrypt hashing with 10 salt rounds for all stored passwords
- **Session security** - HTTP-only cookies, domain-specific configuration, 7-day expiration with activity extension
- **Persistent session storage** - PostgreSQL-based session store ensuring cross-device authentication persistence
- **Enhanced session management** - Session regeneration on login, automatic extension on activity, database validation

### Dashboard and Features
- **Implemented accordion-style project cards** - condensed dashboard UI with collapsible cards that expand to show full details
- **Added In Progress and Complete status options** - expanded project lifecycle with new status tracking for active work
- **Enhanced status workflow** - projects can now progress through: new → responded → proposal-sent → in-progress → complete
- **Updated database schema** - added support for "in-progress" and "complete" statuses in project lifecycle
- **Redesigned card interface** - compact header view shows key info (client, status, timeline) with click-to-expand functionality
- **Improved visual hierarchy** - streamlined status badges with color coding (blue for in-progress, green for complete)
- **Added contextual action buttons** - status-specific buttons appear based on project state (In Progress, Complete, Won/Lost)
- **Persistent Won/Lost buttons** - Won/Lost decision buttons remain available across proposal-sent, follow-up, and in-progress statuses until decision is made
- **Text file proposal system** - Create Proposal button generates and downloads comprehensive proposal as text file for detailed documentation
- **Enhanced email reliability** - Improved mailto functionality with fallback clipboard support for email content when default client fails to open
- **Secure data handling** - All project data stored securely in PostgreSQL database with proper encryption and validation
- **Removed budget range field completely** - eliminated budget selection from contact form, database schema, and all related UI components
- **Updated pricing approach** - pricing now based on project type rather than client budget ranges, with fixed transparent rates
- **Added PayPal payment integration** - included PayPal.me/guidatollc links in all email templates (initial response, follow-up, and proposals)
- **Enhanced project request workflow** - streamlined form focuses on project type and timeline with simplified proposal generation
- **Updated email templates** - all three email types now include PayPal payment information and flexible payment terms
- **Cleaned up prompt generation** - removed budget-based considerations, focusing on project type requirements instead
- **Maintained dashboard functionality** - preserved all existing features (search, tabs, status tracking) with improved UI
- **Implemented Replit Object Storage integration** for portfolio images with fallback to local API serving
- **Added storage management system** with automatic upload capabilities and URL generation
- **Created dynamic image loading** using React Query to fetch images from storage API
- **Enhanced image serving architecture** with proper error handling and development fallbacks
- **Cleaned up portfolio projects** - removed all dummy/placeholder projects, keeping only 5 authentic client projects
- **Updated project filtering system** - now supports filtering between Web Apps and E-commerce categories with functional filter buttons
- **Updated developer image** - replaced with professional photo of Black developer at coding workspace with natural, realistic appearance
- **Updated footer services** - removed outdated AI-related services, now displays correct web development offerings
- **Fixed contact form processing** - resolved TypeScript errors and ensured proper data submission to dashboard
- **Enhanced project request system** - forms now correctly generate detailed project briefs and appear in dashboard
- **Updated contact section image** - replaced with illustration showing client waiting for developer response
- **Implemented secure authentication system** - dashboard now protected with username/password login
- **Added comprehensive project management workflow** - automatic status updates, proposal generation, and client response features
- **Created PostgreSQL database integration** - migrated from memory storage to persistent database storage
- Added Texas Showdown 2026 as featured project - a real fighting game tournament website (https://txshowdown.com/)
- Updated project showcase to include actual completed work: Texas Showdown, Jamaica Restaurant, Faith Ministry, Power of the Lamb, Brain Discord Bot
- Implemented functional Live Demo buttons that link to real projects
- Removed all AI-related messaging and terminology throughout the application
- Updated name from "Emperor Gavin" to "Gavin Anthony" across all components and documentation
- Enhanced projects section with abstract tech imagery instead of people-focused visuals

## Previous Changes (August 12, 2025)
- Updated services section to focus on web development capabilities, removing mobile app development
- Modified project showcase to include web applications, landing pages, and e-commerce instead of mobile apps
- Updated contact form project types to reflect accurate web development services
- Enhanced prompt generation system to provide detailed technical briefs for web-focused projects
- Updated developer identity: Changed name to Gavin Anthony, email to projects@gavineanthony.com, location to Austin, TX, Twitter/X: https://x.com/gavineanthony
- Redesigned services to reflect professional development capabilities with pricing:
  - Full-Stack Development: $4,000 - $4,800 (Complete web application development)
  - Rapid Prototyping: $2,450 - $3,150 (Modern proof-of-concept development)
  - Website Redesign: $850 - $1,200 (Transform existing websites with modern design and enhanced functionality)
  - Landing Pages: $1,375 - $1,925 (High-converting pages with modern design and optimization)
  - Static Web Page Development: $1,500 - $2,000 (Professional static websites with modern design and optimization)
  - API Integration: $1,800 - $2,400 (Seamless third-party service integration)
- Removed Interactive Learning service to focus on core development capabilities
- Added Full-Stack Development as the primary service offering with comprehensive project phases

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query for server state management and form handling with React Hook Form
- **Form Validation**: Zod schemas for runtime type validation and form validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API endpoints for project request management
- **Request Handling**: Express middleware for JSON parsing, CORS, and request logging
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development Server**: Vite integration for hot module replacement during development

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing
- **Production Storage**: Neon Database (serverless PostgreSQL) for production deployment
- **Object Storage**: Replit Object Storage for portfolio images with automatic fallback to local API serving
- **Image Management**: Custom StorageManager class handling upload/download operations with error handling
- **Data Validation**: Shared Zod schemas between frontend and backend for consistent validation

## External Dependencies
- **Database Provider**: Neon Database for serverless PostgreSQL hosting
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Form Management**: React Hook Form with Hookform Resolvers for Zod integration
- **Date Handling**: date-fns for date formatting and manipulation
- **Development Tools**: Vite for fast development builds and hot reload
- **Runtime Error Handling**: Replit-specific error overlay for development debugging

The application uses a monorepo structure with shared types and schemas, enabling type safety across the full stack. The contact form generates structured project briefs using a prompt generation system, making it easy for the developer to understand client requirements and respond appropriately.