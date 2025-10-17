import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export default upload;
