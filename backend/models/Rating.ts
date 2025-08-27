import { Schema, model, Types } from 'mongoose';

interface IRating {
  user_id: Types.ObjectId;
  photo_id: Types.ObjectId;
  rating: number; 
  created_at: Date;
  updated_at: Date;
}

const ratingSchema = new Schema<IRating>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  photo_id: { type: Schema.Types.ObjectId, ref: 'Photo', required: true },
  rating: { type: Number, required: true, min: 0.5, max: 5 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

ratingSchema.index({ user_id: 1, photo_id: 1 }, { unique: true });

const Rating = model<IRating>('Rating', ratingSchema);

export default Rating;
