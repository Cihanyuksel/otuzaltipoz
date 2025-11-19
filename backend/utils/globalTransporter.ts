import { Resend } from "resend";
import nodemailer from "nodemailer";
import { config } from "../config/config";

const resend = new Resend(config.email.smtp.auth.password);

let devTransporter: nodemailer.Transporter | null = null;

const initDevTransporter = async () => {
  if (!devTransporter) {
    try {
      const account = await nodemailer.createTestAccount();
      devTransporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      console.log("Dev Mail Transporter Ready (Ethereal)");
    } catch (err) {
      console.error("Dev Mail Setup Failed:", err);
    }
  }
  return devTransporter;
};

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  from = "Otuzaltıpoz <noreply@otuzaltipoz.com>",
  replyTo,
}: SendEmailParams) => {
  // --- PRODUCTION (RESEND SDK) ---
  if (config.node_env === "production") {
    try {
      const data = await resend.emails.send({
        from,
        to,
        subject,
        html,
        replyTo,
      });

      if (data.error) {
        console.error("Resend API Error:", data.error);
        throw new Error(data.error.message);
      }

      console.log("Email sent via Resend SDK ID:", data.data?.id);
      return data;
    } catch (error) {
      console.error("Failed to send email via Resend:", error);
      throw error;
    }
  }

  // --- DEVELOPMENT (NODEMAILER) ---
  else {
    const transporter = await initDevTransporter();
    if (!transporter) throw new Error("Dev transporter not initialized");

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    console.log("Dev Email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    return info;
  }
};
