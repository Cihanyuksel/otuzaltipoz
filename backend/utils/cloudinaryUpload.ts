import { Readable } from "stream";
import cloudinary, { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { config } from "../config/config";

type CloudinaryUploadOptions = UploadApiOptions;

export const streamUpload = (
  buffer: Buffer,
  options: CloudinaryUploadOptions
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions: CloudinaryUploadOptions = {
      ...options,
      folder: `${config.cloudinary.folder}/${options.folder || "general"}`,
    };

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result) {
          return resolve(result);
        }
        reject(new Error("Cloudinary'den bir yanıt alınamadı."));
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};
