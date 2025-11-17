import mongoose from "mongoose";
import { config } from "./config";

const MONGO_URI = config.mongodb.uri || "";

export const connectDB = async () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB bağlantisi basarili");
    })
    .catch((err) => {
      console.error("❌ MongoDB bağlanti hatasi:", err);
      process.exit(1);
    });
};
