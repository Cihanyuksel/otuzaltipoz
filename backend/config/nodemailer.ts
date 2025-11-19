import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { config } from "./config";

export const initializeTransporter = async (): Promise<Transporter | null> => {
  if (config.node_env === "production") {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: config.email.smtp.auth.username,
        pass: config.email.smtp.auth.password,
      },
    } as SMTPTransport.Options);
  } else {
    try {
      const account = await nodemailer.createTestAccount();
      console.log(account, "--- ETHEREAL ACCOUNT CREATED ---");
      return nodemailer.createTransport({
        host: account.smtp.host,
        port: Number(account.smtp.port),
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    } catch (error) {
      console.error("Failed to create a test account:", error);
      return null;
    }
  }
};
