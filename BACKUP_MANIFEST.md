## Application File Structure
./BACKUP_INFO.md
./.cache/replit/env/latest.json
./.cache/replit/last_scan_result.json
./.cache/replit/nix/dotreplitenv.json
./.cache/replit/toolchain.json
./client/src/App.tsx
./client/src/components/about-section.tsx
./client/src/components/contact-section.tsx
./client/src/components/footer.tsx
./client/src/components/hero-section.tsx
./client/src/components/navigation.tsx
./client/src/components/projects-section.tsx
./client/src/components/services-section.tsx
./client/src/components/ui/accordion.tsx
./client/src/components/ui/alert-dialog.tsx
./client/src/components/ui/alert.tsx
./client/src/components/ui/aspect-ratio.tsx
./client/src/components/ui/avatar.tsx
./client/src/components/ui/badge.tsx
./client/src/components/ui/breadcrumb.tsx
./client/src/components/ui/button.tsx
./client/src/components/ui/calendar.tsx
./client/src/components/ui/card.tsx
./client/src/components/ui/carousel.tsx
./client/src/components/ui/chart.tsx
./client/src/components/ui/checkbox.tsx
./client/src/components/ui/collapsible.tsx
./client/src/components/ui/command.tsx
./client/src/components/ui/context-menu.tsx
./client/src/components/ui/dialog.tsx
./client/src/components/ui/drawer.tsx
./client/src/components/ui/dropdown-menu.tsx
./client/src/components/ui/form.tsx
./client/src/components/ui/hover-card.tsx
./client/src/components/ui/input-otp.tsx
./client/src/components/ui/input.tsx
./client/src/components/ui/label.tsx
./client/src/components/ui/menubar.tsx
./client/src/components/ui/navigation-menu.tsx
./client/src/components/ui/pagination.tsx
./client/src/components/ui/popover.tsx
./client/src/components/ui/progress.tsx
./client/src/components/ui/radio-group.tsx
./client/src/components/ui/resizable.tsx
./client/src/components/ui/scroll-area.tsx
./client/src/components/ui/select.tsx
./client/src/components/ui/separator.tsx
./client/src/components/ui/sheet.tsx
./client/src/components/ui/sidebar.tsx
./client/src/components/ui/skeleton.tsx
./client/src/components/ui/slider.tsx
./client/src/components/ui/switch.tsx
./client/src/components/ui/table.tsx
./client/src/components/ui/tabs.tsx
./client/src/components/ui/textarea.tsx
./client/src/components/ui/toaster.tsx
./client/src/components/ui/toast.tsx
./client/src/components/ui/toggle-group.tsx
./client/src/components/ui/toggle.tsx
./client/src/components/ui/tooltip.tsx
./client/src/hooks/useAuth.tsx
./client/src/hooks/use-mobile.tsx
./client/src/hooks/use-portfolio-images.ts
./client/src/hooks/use-toast.ts
./client/src/lib/prompt-generator.ts
./client/src/lib/queryClient.ts
./client/src/lib/utils.ts
./client/src/main.tsx
./client/src/pages/dashboard-backup.tsx
./client/src/pages/dashboard-broken.tsx
./client/src/pages/dashboard.tsx
./client/src/pages/home.tsx
./client/src/pages/login.tsx
./client/src/pages/not-found.tsx
./client/src/pages/privacy-policy.tsx
./client/src/pages/terms-of-service.tsx
./components.json
./.config/.semgrep/semgrep_rules.json
./DEPLOYMENT_CHECKLIST.md
./DEPLOYMENT.md
./drizzle.config.ts
./.local/state/replit/agent/filesystem/filesystem_state.json
./.local/state/replit/agent/.latest.json
./package.json
./package-lock.json
./postcss.config.js
./replit.md
./SECURITY.md
./server/db.ts
./server/email-service.ts
./server/index.ts
./server/routes.ts
./server/storage-manager.ts
./server/storage.ts
./server/vite.ts
./shared/schema.ts
./tailwind.config.ts
./TROUBLESHOOTING.md
./tsconfig.json
./.upm/store.json
./vite.config.ts

## Asset Files
total 944
-rw------- 1 runner runner 477781 Aug 16 15:09 jamaica-restaurant.png
-rw------- 1 runner runner 477781 Aug 16 15:10 jamaica-restaurant.webp

## Configuration Files
- package.json: 113 lines
- tsconfig.json: 23 lines  
- tailwind.config.ts: 95 lines
- vite.config.ts: 37 lines

## Database Schema
4 tables/schemas defined

## Server Routes
13 API endpoints configured

## Component Count
54 React components
## Critical Application State (August 16, 2025)

### Database Status
- Environment: PostgreSQL via Neon (production ready)
- Test data: Removed (6 entries purged)
- Live data: 1 legitimate project request (Living Manna Online Church)
- Session storage: PostgreSQL-based for production persistence

### Security Configuration
- Cookie security: secure: isProduction (HTTPS-only in production)
- Session management: 7-day expiration with activity extension
- Rate limiting: 100 requests per 15 minutes in production
- Headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- Authentication: bcrypt with 10 salt rounds

### Asset Management Status
- Jamaica restaurant: NEW authentic logo (jamaica-restaurant.png)
- All project images: Properly served via /api/assets/ endpoints
- Fallback system: Local assets when object storage unavailable
- Image formats: PNG for new uploads, mixed legacy formats

### SEO & Performance
- Sitemap: Dynamic generation with current timestamps
- Robots.txt: Proper indexing rules, admin areas blocked
- Meta tags: Complete OpenGraph, Twitter Cards, structured data
- Email references: Consistently projects@gavineanthony.com

### Production Readiness Checklist
✅ Authentication system working
✅ Database cleaned and optimized  
✅ Asset serving functional
✅ Email notifications configured
✅ Security headers implemented
✅ SEO optimization complete
✅ Session persistence working
✅ Rate limiting active
