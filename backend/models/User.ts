import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from 'bcrypt';
import Photo from "./Photo";
import Like from "./Likes";
import Comment from "./Comment";
import Rating from "./Rating";


export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    full_name: string,
    role: "user" | "admin" | "moderator",
    is_active: boolean,
    is_verified: boolean,
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
        is_verified: {type: Boolean, default: false}
    },

    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
)

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error: any) {
        next(error)
    }
})

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
      const photoResult = await Photo.deleteMany({ user_id: userId });
      console.log(`${photoResult.deletedCount} adet fotoğraf silindi.`);
  
      const commentResult = await Comment.deleteMany({ user: userId });
      console.log(`${commentResult.deletedCount} adet yorum silindi.`);
  
      const likeResult = await Like.deleteMany({ user: userId });
      console.log(`${likeResult.deletedCount} adet beğeni/puan silindi.`);
      
      const ratingResult = await Rating.deleteMany({ user: userId });
      console.log(`${ratingResult.deletedCount} adet rating/puanlama silindi.`);
      
    } catch (err) {
      console.error("Kullanıcı ilişkili verilerini silerken hata oluştu:", err);
    }
  });
  

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);


export default User;