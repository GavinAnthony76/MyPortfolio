# Email System Setup Guide

## Overview
Your portfolio application now includes a comprehensive email notification system using Namecheap Private Email SMTP with Nodemailer. When visitors submit project requests through your contact form, the system will:

1. **Send you an internal notification** with all project details
2. **Send an automatic confirmation** to the client acknowledging their request
3. **Save the project request** to your dashboard as before

## Required Environment Variables

Add these to your **Replit Secrets** (never commit these to code):

```
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=projects@gavineanthony.com
SMTP_PASS=your_email_password_here
FROM_EMAIL=projects@gavineanthony.com
INTERNAL_TO=support@gavineanthony.com
REPLY_TO=support@gavineanthony.com
```

## Setting Up Namecheap Private Email

1. **Purchase Private Email from Namecheap** (if not already done)
2. **Create the mailbox**: projects@gavineanthony.com
3. **Get the password** for this mailbox 
4. **Configure SMTP settings** in Replit Secrets panel

### SMTP Settings for Namecheap Private Email:
- **Host**: mail.privateemail.com  
- **Port**: 587 (with STARTTLS)
- **Security**: false (uses STARTTLS)
- **Authentication**: Your email and password

## Email Addresses Explained

- **SMTP_USER**: The email account credentials for sending emails
- **FROM_EMAIL**: The "From" address on all outgoing emails  
- **INTERNAL_TO**: Where you want to receive project notifications (your inbox)
- **REPLY_TO**: Where clients should reply (usually same as FROM_EMAIL)

## Features Added

✅ **Automatic client confirmation emails** with professional HTML formatting  
✅ **Internal project notifications** with complete form details  
✅ **Rate limiting** (5 contact requests per 10 minutes per IP)  
✅ **Security headers** with Helmet middleware  
✅ **Graceful error handling** (form still works if email fails)  
✅ **Professional email templates** with your branding

## Testing

Test your contact form after adding the environment variables. Check:

1. **Client receives** a professional confirmation email
2. **You receive** a detailed project notification
3. **Dashboard still shows** the project request as before
4. **Rate limiting works** (try submitting 6 times quickly)

## Benefits

- **Professional appearance** with automatic responses
- **Never miss a request** with instant email notifications  
- **Simplified deployment** (no external email service API keys)
- **Cost effective** using your existing email hosting
- **Reliable delivery** through established email infrastructure

## Troubleshooting

If emails aren't sending:
1. **Check Replit Secrets** - ensure all variables are set correctly
2. **Verify mailbox password** - test login to webmail interface
3. **Check server logs** - look for SMTP connection errors
4. **Test SMTP settings** manually with email client

The contact form will continue working and saving requests even if email fails.