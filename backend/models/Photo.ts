import { Schema, model, Types } from "mongoose";

interface IPhoto {
  user_id: Types.ObjectId;
  photo_url: string;
  title: string;
  description?: string;
  created_at: Date;
  tags?: string[];
}

const photoSchema = new Schema<IPhoto>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  photo_url: { type: String, required: true },
  title: {
    type: String,
    required: true,
    minlength: [3, "Başlık en az 3 karakter olmalıdır."],
    maxlength: [25, "Başlık en fazla 25 karakter olmalıdır."],
  },
  description: {
    type: String,
    maxlength: [400, "Açıklama en fazla 400 karakter olmalıdır."],
  },
  created_at: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
});

const Photo = model<IPhoto>("Photo", photoSchema);

export default Photo;
