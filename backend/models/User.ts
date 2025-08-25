import mongoose, { Document, Schema, Model } from "mongoose";
import bcrpyte from 'bcrypt';
import Photo from "./Photo";


export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    full_name: string,
    role: "user" | "admin" | "moderator",
    is_active: boolean,
    created_at: Date,
    updated_at: Date,
    profile_img_url?: string,
    comparePassword(candidatePassword: string): Promise<boolean>;
}


const UserSchema: Schema<IUser> = new Schema(
    {
        username: {type: String, required: true, unique: true, trim: true},
        email: { type: String, required: true, unique: true, lowercase: true, trim: true},
        password: {type: String, required: true},
        full_name: {type: String, required: true, trim:true},
        role: {type: String, enum: ["user", "admin", "moderator"],  default: "user"},
        is_active: { type: Boolean, default: false },
        profile_img_url: { type: String },
    },

    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
)

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrpyte.genSalt(12);
        this.password = await bcrpyte.hash(this.password, salt)
    } catch (error: any) {
        next(error)
    }
})

UserSchema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    return await bcrpyte.compare(candidatePassword, this.password);
};

UserSchema.post("findOneAndDelete", async function (deletedUser) {
    if (deletedUser) {
      await Photo.deleteMany({ user_id: deletedUser._id });
    }
  });

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);


export default User;