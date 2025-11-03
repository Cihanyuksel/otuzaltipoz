import { Schema, model, Types } from "mongoose";
import Rating from "./Rating";
import Comment from "./Comment";
import Like from "./Likes";

interface IPhoto {
  user_id: Types.ObjectId;
  photo_url: string;
  title: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  tags?: string[];
  categories: Types.ObjectId[];
}

const photoSchema = new Schema<IPhoto>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  photo_url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Başlık en az 3 karakter olmalıdır."],
    maxlength: [50, "Başlık en fazla 25 karakter olmalıdır."],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [400, "Açıklama en fazla 400 karakter olmalıdır."],
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  categories: {
    type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    required: [true, "En az bir kategori seçmelisiniz."],
    validate: {
      validator: function (v: Types.ObjectId[]) {
        return v && v.length >= 1 && v.length <= 3;
      },
      message: "Her fotoğraf en az 1, en fazla 3 kategori içermelidir.",
    },
  },
});

// Zaman damgasını güncelle
photoSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

photoSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: new Date() });
  next();
});

photoSchema.pre("findOneAndDelete", async function (next) {
  try {
    const photo = await this.model.findOne(this.getQuery());
    if (!photo?._id) return next();

    await Promise.all([
      Like.deleteMany({ photo_id: photo._id }),
      Rating.deleteMany({ photo_id: photo._id }),
      Comment.deleteMany({ photo: photo._id }),
    ]);

    next();
  } catch (err) {
    next(err as Error);
  }
});

// İndeksler
photoSchema.index({ user_id: 1, created_at: -1 });
photoSchema.index({ categories: 1 });
photoSchema.index({ title: "text" });

const Photo = model<IPhoto>("Photo", photoSchema);

export default Photo;
