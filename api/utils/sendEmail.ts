import nodemailer from 'nodemailer';
import { generateEmailTemplate } from './emailTemplate';

type EmailType = 'passwordReset' | 'welcome' | 'verifyEmail';

const sendEmail = async (
  to: string,
  subject: string,
  emailType: EmailType,
  buttonLink: string,
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const htmlContent = generateEmailTemplate(emailType, buttonLink);
  const text = `${subject}\nClick the link below\n${buttonLink}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text, // Fallback text
    html: htmlContent,
  });
};

export default sendEmail;
