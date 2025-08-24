import mongoose, {Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
    text: String,
    user: mongoose.Types.ObjectId,
    photo: mongoose.Types.ObjectId,
    created_at: Date,
    updated_at: Date
}

const commentSchema = new Schema<IComment>(
    {
    text: {type: String, required: true, trim: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    photo: {type: mongoose.Schema.Types.ObjectId, ref: "Photo", required: true},
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema)

export default Comment;