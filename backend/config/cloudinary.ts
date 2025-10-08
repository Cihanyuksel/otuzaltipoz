import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { config } from "./config";

dotenv.config();

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export default cloudinary;
