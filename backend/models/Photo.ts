import { Schema, model, Types } from 'mongoose';

interface IPhoto {
  user_id: Types.ObjectId;
  photo_url: string;
  title: string;
  description?: string;
  created_at: Date;
  tags?: string[];
}

const photoSchema = new Schema<IPhoto>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  photo_url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  tags: { type: [String], default: [] }
});

const Photo = model<IPhoto>('Photo', photoSchema);

export default Photo;
