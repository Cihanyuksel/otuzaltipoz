import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import Photo from "./Photo";
import Like from "./Likes";
import Comment from "./Comment";
import Rating from "./Rating";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: "user" | "admin" | "moderator";
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  profile_img_url?: string;
  bio?: string;
  username_change_count: number;
  last_ai_usage_date?: Date;
  daily_ai_usage_count: number;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    full_name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    is_active: { type: Boolean, default: false },
    profile_img_url: { type: String },
    bio: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    username_change_count: { type: Number, default: 0 },
    last_ai_usage_date: { type: Date },
    daily_ai_usage_count: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// CASCADE DELETE
UserSchema.post("findOneAndDelete", async function (deletedUser) {
  if (!deletedUser) return;

  const userId = deletedUser._id;

  try {
    await Photo.deleteMany({ user_id: userId });
    await Comment.deleteMany({ user: userId });
    await Like.deleteMany({ user_id: userId });
    await Rating.deleteMany({ user_id: userId });
  } catch (err) {
    console.error("Kullanıcı ilişkili verilerini silerken hata oluştu:", err);
  }
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
