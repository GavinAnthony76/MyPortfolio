import nodemailer from "nodemailer";

export function makeTransport() {
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true"; // true for 465
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  
  return nodemailer.createTransport({
    host, 
    port, 
    secure,
    auth: { user, pass }
  });
}

export async function sendInternalNotification(
  to: string, 
  from: string, 
  payload: Record<string, string | undefined>
) {
  const transport = makeTransport();
  const lines = Object.entries(payload)
    .map(([k, v]) => `${k}: ${v ?? ""}`)
    .join("\n");
    
  await transport.sendMail({
    from,
    to,
    subject: "New Project Request - Portfolio Website",
    text: `A new project request has been submitted:\n\n${lines}`,
    html: `
      <h2>New Project Request</h2>
      <p>A new project request has been submitted through your portfolio website:</p>
      <br>
      ${Object.entries(payload)
        .map(([k, v]) => `<strong>${k}:</strong> ${v ?? ""}<br>`)
        .join("")}
    `,
  });
}

export async function sendAutoReply(
  to: string, 
  from: string, 
  clientName: string,
  replyTo?: string
) {
  const transport = makeTransport();
  
  await transport.sendMail({
    from,
    to,
    replyTo,
    subject: "Thanks — we received your project request",
    text: [
      `Hi ${clientName},`,
      "",
      "Thanks for reaching out to Gavin Anthony. We received your project request and will contact you shortly.",
      "",
      "Typical response time: 1 business day.",
      "",
      "If this is urgent, feel free to email gavin@gavineanthony.com directly.",
      "",
      "Best regards,",
      "Gavin Anthony",
      "Full-Stack Developer",
      "Austin, TX"
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank you for your project request!</h2>
        
        <p>Hi ${clientName},</p>
        
        <p>Thanks for reaching out to <strong>Gavin Anthony</strong>. We received your project request and will contact you shortly.</p>
        
        <p><strong>Typical response time:</strong> 1 business day.</p>
        
        <p>If this is urgent, feel free to email <a href="mailto:gavin@gavineanthony.com">gavin@gavineanthony.com</a> directly.</p>
        
        <br>
        <p>Best regards,<br>
        <strong>Gavin Anthony</strong><br>
        Full-Stack Developer<br>
        Austin, TX</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          This is an automated response. Please do not reply directly to this email.
        </p>
      </div>
    `
  });
}