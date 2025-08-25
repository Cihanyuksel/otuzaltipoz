import { Schema, model, Types } from "mongoose";

interface ILike {
    user_id: Types.ObjectId;
    photo_id: Types.ObjectId;
    created_at: Date
  }

const LikeSchema = new Schema<ILike>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  photo_id: { type: Schema.Types.ObjectId, ref: "Photo", required: true },
  created_at: { type: Date, default: Date.now }
});

LikeSchema.index({ user_id: 1, photo_id: 1 }, { unique: true });

const Like = model<ILike>('Like', LikeSchema);

export default Like;