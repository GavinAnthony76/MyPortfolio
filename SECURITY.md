# Security Guidelines

## Credential Management

### Environment Variables
All sensitive credentials are managed through environment variables:

- `ADMIN_USERNAME` - Dashboard admin username
- `ADMIN_PASSWORD` - Dashboard admin password (required)
- `SESSION_SECRET` - Session encryption key
- `DATABASE_URL` - Database connection string
- `PAYPAL_CLIENT_ID` - PayPal integration (optional)
- `PAYPAL_CLIENT_SECRET` - PayPal integration (optional)

### Production Deployment
1. Set all required environment variables in Replit deployment settings
2. Never commit sensitive credentials to version control
3. Use strong, unique passwords for admin access
4. Regularly rotate session secrets and admin passwords

### Session Security
- Sessions are encrypted using bcrypt with salt rounds of 10
- Session cookies are configured with:
  - `httpOnly: true` - Prevents XSS access
  - `sameSite: 'lax'` - CSRF protection
  - `maxAge: 24 hours` - Automatic expiration
  - Domain-specific configuration for production

### Authentication Flow
1. Login credentials are validated against hashed passwords in database
2. Successful login creates an encrypted session
3. Session ID is stored in secure HTTP-only cookies
4. All dashboard routes require valid session authentication
5. Sessions expire automatically after 24 hours

### Security Headers
Production deployment includes comprehensive security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` for camera, microphone, geolocation restrictions

### Best Practices
- Admin passwords should be strong (minimum 12 characters, mixed case, numbers, symbols)
- Session secrets should be randomly generated (minimum 32 characters)
- Regular security audits and dependency updates
- Monitor authentication logs for suspicious activity

### Emergency Procedures
If credentials are compromised:
1. Immediately change `ADMIN_PASSWORD` in deployment settings
2. Regenerate `SESSION_SECRET` to invalidate all existing sessions
3. Review access logs for unauthorized activity
4. Update any other potentially compromised credentials