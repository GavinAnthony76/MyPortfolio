import { MailService } from '@sendgrid/mail';
import type { ProjectRequest } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };
    
    if (params.text) {
      emailData.text = params.text;
    }
    
    if (params.html) {
      emailData.html = params.html;
    }
    
    await mailService.send(emailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendNewProjectRequestNotification(request: ProjectRequest): Promise<boolean> {
  const projectTypeLabels: Record<string, string> = {
    'fullstack': 'Full-Stack Development',
    'prototype': 'Rapid Prototype/POC',
    'pwa': 'Progressive Web Applications',
    'landing': 'Landing Pages',
    'static': 'Static Web Page Development',
    'integration': 'API Integration',
    'other': 'Custom Development'
  };

  const projectTypeLabel = projectTypeLabels[request.projectType] || request.projectType;
  const companyInfo = request.company ? ` from ${request.company}` : '';
  
  const subject = `New Project Request: ${projectTypeLabel} - ${request.firstName} ${request.lastName}`;
  
  const textContent = `
NEW PROJECT REQUEST RECEIVED

Client Information:
- Name: ${request.firstName} ${request.lastName}
- Email: ${request.email}
- Company: ${request.company || 'Not specified'}

Project Details:
- Type: ${projectTypeLabel}
- Timeline: ${request.timeline}
- Description: ${request.description}

Additional Information:
- Target Audience: ${request.targetAudience || 'Not specified'}
- Key Features: ${request.keyFeatures || 'Not specified'}
- Tech Preferences: ${request.techPreferences || 'Not specified'}
- Design References: ${request.designReferences || 'Not specified'}
- Additional Info: ${request.additionalInfo || 'Not specified'}

Generated Brief:
${request.generatedPrompt}

Dashboard: https://www.gavineanthony.com/dashboard
Request ID: ${request.id}
Submitted: ${new Date(request.createdAt).toLocaleString()}
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
      <div style="background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #1f2937; margin-bottom: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
          🚀 New Project Request Received
        </h1>
        
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin-bottom: 24px;">
          <h2 style="color: #1e40af; margin: 0 0 8px 0; font-size: 18px;">${projectTypeLabel}</h2>
          <p style="color: #374151; margin: 0; font-size: 16px;">
            <strong>${request.firstName} ${request.lastName}</strong>${companyInfo}
          </p>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #374151; margin-bottom: 12px;">Client Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; color: #374151;">${request.firstName} ${request.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; color: #374151;"><a href="mailto:${request.email}" style="color: #3b82f6;">${request.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Company:</strong></td>
              <td style="padding: 8px 0; color: #374151;">${request.company || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Timeline:</strong></td>
              <td style="padding: 8px 0; color: #374151;">${request.timeline.replace('-', ' ')}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #374151; margin-bottom: 12px;">Project Description</h3>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; color: #374151; line-height: 1.6;">
            ${request.description}
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #374151; margin-bottom: 12px;">Additional Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${request.targetAudience ? `<tr><td style="padding: 4px 0; color: #6b7280; width: 140px;"><strong>Target Audience:</strong></td><td style="padding: 4px 0; color: #374151;">${request.targetAudience}</td></tr>` : ''}
            ${request.keyFeatures ? `<tr><td style="padding: 4px 0; color: #6b7280;"><strong>Key Features:</strong></td><td style="padding: 4px 0; color: #374151;">${request.keyFeatures}</td></tr>` : ''}
            ${request.techPreferences ? `<tr><td style="padding: 4px 0; color: #6b7280;"><strong>Tech Preferences:</strong></td><td style="padding: 4px 0; color: #374151;">${request.techPreferences}</td></tr>` : ''}
            ${request.designReferences ? `<tr><td style="padding: 4px 0; color: #6b7280;"><strong>Design References:</strong></td><td style="padding: 4px 0; color: #374151;">${request.designReferences}</td></tr>` : ''}
            ${request.additionalInfo ? `<tr><td style="padding: 4px 0; color: #6b7280;"><strong>Additional Info:</strong></td><td style="padding: 4px 0; color: #374151;">${request.additionalInfo}</td></tr>` : ''}
          </table>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="https://www.gavineanthony.com/dashboard" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
            View in Dashboard
          </a>
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Request ID: <code>${request.id}</code></p>
          <p>Submitted: ${new Date(request.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail({
    to: 'gavineanthony@outlook.com',
    from: 'gavineanthony@outlook.com', // Use verified sender email
    subject: subject,
    text: textContent,
    html: htmlContent
  });
}