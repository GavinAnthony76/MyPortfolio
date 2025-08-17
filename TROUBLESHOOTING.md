# Troubleshooting Guide

## Dashboard Login Issues

### Issue: "Login successful" but dashboard doesn't load

**Symptoms:**
- Login form shows "successful" message
- Redirects to dashboard but shows loading/login page
- Authentication seems to work but session isn't maintained

**Possible Causes & Solutions:**

1. **Cookie Domain Issues (Most Common)**
   - **Problem**: Session cookies not being set/read correctly for custom domain
   - **Debug**: Open browser dev tools → Application tab → Cookies
   - **Check**: Is there a `sessionId` cookie for your domain?
   - **Solution**: Verify DNS is fully propagated and SSL is working

2. **SSL Certificate Issues**
   - **Problem**: Secure cookies failing on non-HTTPS domains
   - **Debug**: Check if site loads with HTTPS
   - **Solution**: Wait for Replit to generate SSL certificate (can take up to 48 hours)

3. **Session Configuration**
   - **Problem**: Production session settings incompatible
   - **Current Config**: `secure: false`, `sameSite: 'lax'`, domain set for production
   - **Solution**: These settings are optimized for debugging

### Debug Steps:

1. **Check Browser Console**
   ```
   Look for "Auth status:" logs
   Should show: { authStatus: { authenticated: true }, isLoading: false, error: null }
   ```

2. **Test API Directly**
   ```bash
   # Check if login endpoint works
   curl -X POST "https://www.gavineanthony.com/api/login" \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"@nT##3275"}' \
     -c cookies.txt -v
   
   # Check if session persists
   curl -X GET "https://www.gavineanthony.com/api/auth/status" \
     -b cookies.txt -v
   ```

3. **Check Session Storage**
   - Browser Dev Tools → Application → Cookies
   - Should see `sessionId` cookie with proper domain

4. **Verify Environment Variables**
   - `SESSION_SECRET` should be set in deployment
   - `NODE_ENV=production` should be set

### Admin Credentials:
- Credentials are set via environment variables in deployment settings
- Contact the developer for access credentials

### If Issues Persist:

1. **Try Incognito/Private Browser**
   - Rules out browser cache issues

2. **Clear Browser Data**
   - Clear cookies and localStorage for the domain

3. **Check Network Tab**
   - Look for failed authentication requests
   - Verify cookies are being sent with requests

4. **Temporary Workaround**
   - Access dashboard directly via Replit app URL instead of custom domain
   - This bypasses any DNS/SSL issues

### Production vs Development Differences:

**Development (localhost:5000):**
- No SSL required
- Simple session configuration
- Direct domain access

**Production (www.gavineanthony.com):**
- Requires valid SSL certificate
- Cross-domain cookie configuration
- DNS propagation dependency

### Contact for Support:
If issues persist after trying these steps, the problem might require deployment-level debugging that can only be done by the developer.