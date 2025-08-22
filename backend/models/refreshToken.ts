import mongoose, { type Document, type Types } from "mongoose";

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  device?: string;
  createdAt: Date;
  expiresAt: Date;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  device: { type: String }, // userAgent vs
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);
