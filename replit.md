# Overview

This project is a professional portfolio website for a full-stack developer, Gavin Anthony, serving as both a public-facing showcase for web development skills and a business tool for managing client project requests. The site features a glassmorphism-inspired light theme with project gallery, case study modals, project status tracking via ticket numbers, testimonials, blog articles, and a Professional Narrator host guide. The business vision is to provide high-quality web development solutions, leveraging a professional online presence and an efficient client management system to attract and serve clients effectively.

## Recent Changes (February 25, 2026)
### Professional Narrator Host System (COMPLETED ✅)
- **Replaces old AI chat widget** - Old `ai-assistant.tsx` removed from App.tsx, replaced with narrator host
- **HostDock** - Persistent floating orb button (bottom-right), blue-purple gradient with breathing animation
- **HostPanel** - Expandable concierge panel with context-aware narrator messages and action chips
- **Experience Mode** - 3-step guided tour with spotlight overlay, keyboard controls (ESC/arrows), step indicators
- **Context-aware narration** - IntersectionObserver detects visible section, updates narrator message/chips
- **Host Playbook** - Configurable per-route and per-section messages, action chips, experience steps
- **Action chips** - Quick navigation buttons: scroll to sections, start experience, navigate routes
- **Ask input** - Site-scoped question input with stub API endpoint `/api/host/ask`
- **First-visit prompt** - Auto-suggests guided experience on first visit, dismissible
- **localStorage persistence** - Collapsed state and experience completion persisted (versioned keys)
- **Keyboard accessible** - ESC to skip tour, arrow keys for navigation, ARIA attributes throughout
- **data-host attributes** - Added to all major sections for spotlight targeting
- **Files added**: host-provider.tsx, host-dock.tsx, host-panel.tsx, experience-overlay.tsx, host-narrator.tsx, section-observer-bridge.tsx, use-section-observer.ts, host-playbook.ts, host-utils.ts

## Recent Changes (February 24, 2026)
### Testimonial Submission & Approval System (COMPLETED ✅)
- **Public testimonial form** - Customers can submit testimonials via "Leave a Testimonial" button
- **Admin approval workflow** - Testimonials require approval in dashboard before appearing publicly
- **Dashboard testimonial management** - Projects/Testimonials view switcher with approve/reject/delete actions
- **Email notifications** - Admin notified via email when new testimonial is submitted
- **Database-backed** - Testimonials stored in PostgreSQL with pending/approved/rejected status
- **Hardcoded + dynamic** - Existing 4 testimonials preserved alongside database-driven ones
- **Email address updated** - All references changed from projects@gavineanthony.com to gavin@gavineanthony.com

### Major Site Redesign + Virtual AI Assistant (COMPLETED ✅)
- **Glassmorphism hero card** - Bold hero with 3 CTAs: View Projects, Start a Project, Check Project Status
- **About/Services/Skills sections removed** - Streamlined site per new spec
- **Project detail modals** - Click any project card to see full case study (problem/solution/features/outcomes)
- **Project status tracking** - New section where users enter ticket number to check project request status
- **Budget range field added** - Contact form now includes budget range select and reference URL
- **Ticket number display** - After form submission, users see and can copy their ticket number
- **AI Assistant rebranded** - Replaced "Edasi" with "Virtual AI Assistant" with comprehensive new system prompt
- **New project types** - E-Commerce Store, SaaS Application, Marketing Site, Internal Tool added
- **Navigation simplified** - Home, Projects, Testimonials, Status, Start a Project
- **Footer updated** - Capabilities list replaces Services list
- **New API endpoint** - GET /api/project-status/:ticketNumber returns status without PII
- **Schema updated** - Added budgetRange and referenceUrl columns to project_requests table

### Previous Dark Theme Redesign (COMPLETED ✅)
- **Dark theme with cyan/purple accents** inspired by txshowdown.com
- **Client testimonials section** - 4 client reviews with star ratings
- **Blog/Articles section** - 3 article previews for SEO
- **Noscript fallback** - Basic HTML content for SEO crawlers
- **Amazon affiliate link** in footer social links

## Recent Changes (October 21, 2025)
### Stripe and Pricing Removal (COMPLETED ✅)
- **Stripe integration removed** - All payment processing functionality eliminated
- **Payment buttons removed** - Service cards now show "Get Started" buttons that scroll to contact form
- **Pricing displays removed** - All dollar amounts removed from service offerings
- **Checkout modal deleted** - Removed checkout-modal.tsx component entirely
- **AI Assistant updated** - Edasi no longer mentions specific prices, directs to contact for quotes
- **Backend cleanup** - Removed Stripe package, API endpoints, and CSP headers
- **Documentation updated** - All pricing and payment references removed from codebase

### Service Restructuring to Simple Tiered Model (COMPLETED ✅)
- **Basic Package introduced** - Single page sites (landing pages, portfolios)
- **Premium Package** - Small local businesses (3-5 pages with hosting)
- **Custom Package** - Complex projects with custom scope
- **Technical Consulting removed** - Streamlined service offerings for clarity
- **Rapid Prototyping** - Fast development cycles for prototypes
- **AI Assistant updated** - Edasi recommends service tiers based on client needs
- **Contact form synchronized** - Project type options match new service structure
- **Documentation updated** - All references aligned with new 4-tier service model

## Recent Changes (August 19, 2025)
### Production Deployment Ready (COMPLETED ✅)
- **Code cleanup completed** - all development console.log statements removed for clean production logs
- **Development artifacts removed** - cleaned temporary files from attached_assets directory
- **Build optimization verified** - production build completes successfully with proper chunking
- **Environment configuration updated** - .env.example includes all required variables (OpenAI, SMTP)
- **Deployment documentation created** - comprehensive DEPLOYMENT_READY.md with checklist and verification steps
- **Security verification** - CSP headers, rate limiting, and authentication properly configured for production

### Project Deletion Functionality (COMPLETED ✅)
- **Delete button added to all project cards** - destructive action with confirmation dialog
- **Confirmation dialog implemented** - shows client details and warns action cannot be undone
- **API endpoint created** - DELETE `/api/project-requests/:id` with authentication protection
- **Database method added** - permanent project removal from storage interface
- **Error handling implemented** - proper validation and user feedback throughout deletion flow
- **Accessible across all dashboard tabs** - delete functionality available regardless of project status

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

### Authentication Flow Restoration (COMPLETED ✅)
- **Reverted to original login flow** - restored working authentication that existed before AI assistant
- **Removed unnecessary navigation changes** - simplified protected route logic back to original
- **Fixed production session configuration** - updated cookie settings for Replit deployment environment
- **Enhanced session security** - proper proxy settings and cross-site compatible cookies for production deployment
- **Resolved authentication caching issue** - implemented no-cache headers on auth endpoints to prevent stale responses
- **Added canonical host redirection** - ensures consistent www.gavineanthony.com usage to prevent cookie conflicts

### Google Tag Manager Analytics Implementation (COMPLETED ✅)
- **GTM container integrated** - Added Google Tag Manager with container ID GTM-K9S7XSP7
- **Proper script placement** - Head script positioned at top of HTML for maximum tracking coverage
- **Noscript fallback** - Iframe implementation for users with JavaScript disabled
- **Analytics ready** - Website now ready for comprehensive visitor tracking and conversion monitoring

### Local Business Pricing Model Update (SUPERSEDED by October 2025 changes)
- **Previous pricing model** - Originally featured specific dollar amounts for all service tiers
- **Replaced by contact-based pricing** - All pricing removed, clients now contact for custom quotes
- **See October 2025 changes above** - Current service structure documented in latest update

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