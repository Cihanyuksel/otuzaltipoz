import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  text: string;
  user: mongoose.Types.ObjectId;
  photo: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId | null;
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
  edit_count: number;
  is_edited: boolean;
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
      required: true,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    isDeleted: { type: Boolean, default: false },
    edit_count: { type: Number, default: 0 },
    is_edited: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Comment: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  commentSchema
);

export default Comment;
