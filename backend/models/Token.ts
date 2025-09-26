import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  type: "emailVerification" | "passwordReset";
  createdAt: Date;
  expiresAt: Date;
}

const tokenSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["emailVerification", "passwordReset"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
