# Overview

This project is a professional portfolio website for a full-stack developer, Gavin Anthony, serving as both a public-facing showcase for web development skills and a business tool for managing client project requests. It aims to market web development services and streamline the intake and management of client inquiries through a robust project request system. The application features sections for personal introduction, featured web projects, service offerings (technical consulting, website redesign, landing pages, static web development, rapid prototyping, full-stack development - arranged by price), and a comprehensive contact form that generates detailed project briefs. These briefs are stored in a database and managed via an administrative dashboard. The business vision is to provide high-quality web development solutions, leveraging a professional online presence and an efficient client management system to attract and serve clients effectively.

## Recent Changes (August 17, 2025)
### Codebase Cleanup and Optimization (COMPLETED ✅)
- **Removed attached_assets directory** - cleaned up all generated and temporary assets
- **Eliminated duplicate documentation** - removed backup files and unnecessary guides
- **Fixed broken imports** - resolved @assets references and image dependencies
- **Authentication redirect fixes** - improved sign-in flow for proper dashboard access
- **Code optimization** - cleaned up unused imports and streamlined components

### Service Restructuring and Price Ordering (COMPLETED ✅)
- **Services reordered by price** - arranged from cheapest to most expensive
- **Technical Consulting positioned first** - $125/hour as the most accessible entry point
- **Full-Stack Development enhanced** - includes API integration as core feature  
- **Service hierarchy optimized** - Technical Consulting → Website Redesign → Landing Pages → Static Development → Rapid Prototyping → Full-Stack Development
- **Contact form updated** - project types match new service order
- **All components synchronized** - services section, contact forms, and documentation aligned

### AI Assistant Implementation (COMPLETED ✅)
- **AI Assistant "Edasi" integrated** - OpenAI-powered intelligent assistant for service recommendations
- **Auto-greeting system** - appears after 3 seconds to welcome visitors
- **Service matching capability** - recommends appropriate services based on user project descriptions
- **Tech stack guidance** - provides technical advice tailored to project requirements
- **Professional chat interface** - minimizable/maximizable with conversation history
- **Full-stack developer styling** - gradient colors matching service branding
- **Mobile responsive design** - optimized for all screen sizes with 20% narrower profile
- **Console error resolution** - clean React implementation without warnings
- **Support contact integration** - uses support@gavineanthony.com for technical assistance

### Production Authentication & Asset Management (COMPLETED ✅)
- **Authentication redirect fixed** - enhanced login with window.location.href for reliable production redirects
- **Object storage integration** - migrated from filesystem to Replit Object Storage for all portfolio images
- **Asset serving optimized** - /api/storage/* endpoints serve images directly from object storage
- **Filesystem cleanup** - removed attached_assets and server/assets directories for clean production deployment
- **Image management** - StorageManager class handles upload/download from object storage with proper fallbacks

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **UI Components**: Shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query for server state and form handling with React Hook Form
- **Form Validation**: Zod schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful API endpoints for project request management
- **Request Handling**: Express middleware for JSON parsing, CORS, and request logging
- **Error Handling**: Centralized middleware with proper HTTP status codes
- **Development Server**: Vite integration for hot module replacement

## Data Storage Solutions
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Production Storage**: Neon Database (serverless PostgreSQL)
- **Object Storage**: Replit Object Storage for portfolio images with local API serving fallback
- **Image Management**: Custom StorageManager class for upload/download
- **Data Validation**: Shared Zod schemas for consistent validation

## UI/UX Decisions
- Accordion-style project cards in the dashboard for condensed UI.
- Status badges with color coding for project lifecycle (blue for in-progress, green for complete).
- Compact dashboard card headers with click-to-expand functionality.
- Professional photo of a Black developer at a coding workspace.
- Abstract tech imagery for projects section.
- Streamlined contact form focusing on project type and timeline.

## Technical Implementations
- Secure cookie configuration for production HTTPS.
- SMTP email service with Nodemailer for client confirmations and internal notifications.
- Rate limiting on contact form (5 requests per 10 minutes per IP).
- Helmet middleware for security headers.
- Graceful error handling for email delivery.
- Bcrypt hashing (10 salt rounds) for stored passwords.
- HTTP-only cookies, domain-specific session configuration with 7-day expiration and activity extension.
- PostgreSQL-based persistent session storage.
- Session regeneration on login, automatic extension on activity, database validation.
- Text file proposal generation and download.
- Mailto functionality with fallback clipboard support for email content.
- Dynamic image loading using React Query.
- Monorepo structure with shared types and schemas for full-stack type safety.
- Project request workflow with automatic status updates, proposal generation, and client response features.
- PayPal.me/guidatollc links in all email templates.
- Project filtering system for Web Apps and E-commerce categories.

## Feature Specifications
- Public-facing portfolio showcasing web applications, landing pages, and e-commerce projects.
- Administrative dashboard for managing client project requests.
- Project lifecycle tracking: new → responded → proposal-sent → in-progress → complete.
- Contextual action buttons based on project status (In Progress, Complete, Won/Lost).
- Secure authentication system for dashboard access.
- Functional Live Demo buttons linking to real projects.
- Professional email templates for client communication.

# External Dependencies

- **Database Provider**: Neon Database
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form with Hookform Resolvers (for Zod)
- **Date Handling**: date-fns
- **Development Tools**: Vite
- **Email Service**: Namecheap Private Email (SMTP via Nodemailer)
- **Payment Integration**: PayPal.me
- **Version Control**: Git (implied by Replit environment)