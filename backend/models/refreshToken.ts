import mongoose, { type Document, type Types } from "mongoose";

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  device?: string;
  deviceId?: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  device: { type: String },
  deviceId: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  lastUsedAt: { type: Date, default: Date.now }
});

refreshTokenSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export default mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);