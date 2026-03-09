import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailOptions) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
    throw new Error("SMTP credentials are not set in environment variables");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
};