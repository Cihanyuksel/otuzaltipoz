import { Transporter } from "nodemailer";
import { initializeTransporter } from "../config/nodemailer";

export let globalTransporter: Transporter | null = null;

export const setupTransporter = async () => {
  globalTransporter = await initializeTransporter();
  if (globalTransporter) {
    console.log("Nodemailer Transporter is READY.");
  } else {
    console.error("Nodemailer Transporter setup FAILED.");
  }
};
