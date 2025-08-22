import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "";

export const connectDB = async () => {
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB bağlantisi basarili");
    })
    .catch((err) => {
        console.error("❌ MongoDB bağlanti hatasi:", err);
        process.exit(1)
    })
}

