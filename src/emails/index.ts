import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

let transporter: nodemailer.Transporter;

async function createTransporter() {
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    logger.info({ 
      etherealUser: process.env.EMAIL_USER, 
      etherealPass: process.env.EMAIL_PASSWORD 
    }, 'Test email account created');
    
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!transporter) await createTransporter();
  
  const info = await transporter.sendMail({
    from: `"Remindr App" <${process.env.EMAIL_FROM || 'noreply@Remindrapp.com'}>`,
    to,
    subject,
    html,
  });
  
  logger.info({ 
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info)
  }, 'Email sent');
  
  return info;
}

export async function sendTemplatedEmail(
  to: string, 
  subject: string, 
  templateName: string, 
  variables: Record<string, string>
) {
  const templatePath = path.join(process.cwd(), 'src/emails/templates', `${templateName}.html`);
  let templateContent = fs.readFileSync(templatePath, 'utf8');
  
  Object.entries(variables).forEach(([key, value]) => {
    templateContent = templateContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return sendEmail(to, subject, templateContent);
}