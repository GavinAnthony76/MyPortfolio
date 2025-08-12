# Overview

This is a professional portfolio website for a full-stack developer named Emperor Gavin, featuring both a public-facing portfolio site and an internal project request management system. The application serves as both a marketing tool to showcase web development skills and services, and a business tool to collect and manage client inquiries.

The portfolio includes sections for personal introduction, featured projects (focused on web applications, landing pages, and e-commerce), service offerings (web development, responsive design, e-commerce, consulting, maintenance, and MVP development), and a comprehensive contact form. The contact form generates detailed project briefs that are stored in a database and can be managed through an administrative dashboard.

## Recent Changes (August 12, 2025)
- Updated services section to focus on web development capabilities, removing mobile app development
- Modified project showcase to include web applications, landing pages, and e-commerce instead of mobile apps
- Updated contact form project types to reflect accurate web development services
- Enhanced prompt generation system to provide detailed technical briefs for web-focused projects
- Updated developer identity: Changed name to Emperor Gavin, email to guidato.llc@gmail.com, phone to (254) 300-8158, location to Austin, TX

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