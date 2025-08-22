import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    full_name: string,
    role: "user" | "admin" | "moderator",
    is_active: boolean,
    created_at: Date,
    updated_at: Date,
    profile_img_url?: string
}


const UserSchema: Schema<IUser> = new Schema(
    {
        username: {type: String, required: true, unique: true, trim: true},
        email: { type: String, required: true, unique: true, lowercase: true, trim: true},
        password: {type: String, required: true},
        full_name: {type: String, required: true, trim:true},
        role: {type: String, enum: ["user", "admin", "moderator"],  default: "user"},
        is_active: { type: Boolean, default: true },
        profile_img_url: { type: String },
    },

    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
)

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);


export default User;