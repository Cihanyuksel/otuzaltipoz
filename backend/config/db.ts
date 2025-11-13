// db.ts dosyanızın yeni hali
import mongoose from "mongoose";

// dotenv, path, env ve override kodlarını BURADAN KALDIRIYORUZ!
// Çünkü bu işi ana başlatma dosyasında yapacağız.

const MONGO_URI = process.env.MONGODB_URI || "";
// console.log(MONGO_URI, "MONGO URL"); // Testiniz bitince bu satırı da kaldırın


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