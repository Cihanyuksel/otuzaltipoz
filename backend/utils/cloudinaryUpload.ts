import { Readable } from "stream";
import cloudinary from "../config/cloudinary";
import { config } from "../config/config";

export const streamUpload = (buffer: Buffer, typeFolder: string) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `${config.cloudinary.folder}/${typeFolder}` },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as { secure_url: string });
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};
