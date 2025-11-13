import dotenv from "dotenv";
import path from "path";
const env = process.env.NODE_ENV || "development";
let envPath: string;

if (env === "production") {
  envPath = path.resolve(__dirname, `../.env.prod`);
} else if (env === "test") {
  envPath = path.resolve(__dirname, `./.env.test`);
} else {
  envPath = path.resolve(__dirname, `./.env.dev`);
}
dotenv.config({ path: envPath });

console.log("Server URL:", process.env.SERVER_URL);

import app from "./app";
import { config } from "./config/config";
import { connectDB } from "./config/db";
import { setupTransporter } from "./utils/globalTransporter";

const PORT = config.server.port || 4000;
console.log(`✅ Yüklenen Konfigürasyon: .env.${env}`);
console.log(`✅ Bağlantı Adresi: ${process.env.MONGODB_URI}`);

const initializeApp = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    await setupTransporter();
    console.log("Email transporter initialized.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

initializeApp();
