import { Schema, model } from "mongoose";

interface ICategory {
  name: string;
}

const categorySchema = new Schema<ICategory>({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: [2, "Kategori adı en az 2 karakter olmalıdır."],
    maxlength: [30, "Kategori adı en fazla 30 karakter olabilir."]
  }
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
