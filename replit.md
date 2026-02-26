# Overview

This project is a professional portfolio website for a full-stack developer, Gavin Anthony, serving as both a public-facing showcase for web development skills and a business tool for managing client project requests. The site features a glassmorphism-inspired light theme with a project gallery, case study modals, project status tracking via ticket numbers, testimonials, and blog articles. The business vision is to provide high-quality web development solutions, leveraging a professional online presence and an efficient client management system to attract and serve clients effectively.

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
- **UI/UX Decisions**: Glassmorphism hero card, accordion-style project cards in dashboard, status badges with color coding, professional developer photo, abstract tech imagery, streamlined contact form.


## Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful API endpoints for project request management, including project status and testimonial submission.
- **Request Handling**: Express middleware for JSON parsing, CORS, and request logging.
- **Error Handling**: Centralized middleware with proper HTTP status codes.
- **Authentication**: Secure, PostgreSQL-based persistent session storage with HTTP-only cookies, session regeneration on login, and activity-based extension. Bcrypt hashing (10 salt rounds) for passwords.
- **Development Server**: Vite integration for hot module replacement.

## Data Storage Solutions
- **Database**: PostgreSQL via Drizzle ORM for project requests and testimonials.
- **Schema Management**: Drizzle Kit for migrations.
- **Production Storage**: Neon Database (serverless PostgreSQL).
- **Object Storage**: Replit Object Storage for portfolio images with local API serving fallback.
- **Image Management**: Custom StorageManager class.
- **Data Validation**: Shared Zod schemas for consistent validation.

## Technical Implementations
- **Email Services**: SMTP email service with Nodemailer for client confirmations and internal notifications. Graceful error handling for email delivery.
- **Security**: Helmet middleware for security headers, rate limiting on contact form (5 requests/10 mins/IP), secure cookie configuration for HTTPS.
- **Project Management Workflow**: Public testimonial form with admin approval workflow. Project lifecycle tracking (new → responded → proposal-sent → in-progress → complete) with contextual action buttons. Proposal generation and download.
- **Ticket Number Format**: Custom 12-character ticket numbers generated from submission date. Format: interleaved month letters + year digits (positions 1,3,5 = month chars; 2,4,6,7 = year digits) + 2-digit day + 3-char random suffix. Example: F2E0B2625XYZ = Feb 25 2026. Generated in `server/ticket-generator.ts`.
- **Monorepo Structure**: Shared types and schemas for full-stack type safety.

## Feature Specifications
- Public-facing portfolio with web application, landing page, and e-commerce project showcases.
- Administrative dashboard for managing client project requests, including testimonial management.
- Project status tracking via ticket number lookup.
- Secure authentication for dashboard access.
- Functional Live Demo buttons.
- Professional email templates.
- Project filtering system.

# External Dependencies

- **Database Provider**: Neon Database
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form with Hookform Resolvers (for Zod)
- **Date Handling**: date-fns
- **Development Tools**: Vite
- **Email Service**: Namecheap Private Email (SMTP via Nodemailer)
- **Payment Integration**: PayPal.me (for email links)
- **Analytics**: Google Tag Manager (GTM-K9S7XSP7)