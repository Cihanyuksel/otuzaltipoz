import { AppError } from "./AppError";

// Kategorileri parse eden yardımcı fonksiyon
const parseCategories = (
  categories: string | string[] | undefined
): string[] => {
  if (!categories) return [];

  if (typeof categories === "string") {
    return categories.split(",").map((c) => c.trim());
  }

  if (Array.isArray(categories)) {
    return categories;
  }

  return [];
};

// Tag'leri parse eden yardımcı fonksiyon
const parseTags = (tags: string | undefined): string[] => {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim());
};

// Kategori sayısını validate eden fonksiyon
const validateCategories = (categories: string[]): void => {
  if (categories.length < 1 || categories.length > 3) {
    throw new AppError("1-3 arası kategori seçmelisiniz", 400);
  }
};

export { validateCategories, parseCategories, parseTags };
