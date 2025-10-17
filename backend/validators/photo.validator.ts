import Joi from "joi";

// Get all photos query validation
export const getAllPhotosQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(15),
  offset: Joi.number().integer().min(0).default(0),
  search: Joi.string().trim().allow("").optional(),
  sort: Joi.string().valid("random", "latest").optional(),
  categories: Joi.string().trim().optional(),
});

// Get popular photos query validation
export const getPopularPhotosQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(10),
  timeframe: Joi.string().valid("day", "week", "month", "all").optional(),
});

// Photo ID params validation
export const photoIdParamsSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Geçersiz foto ID formatı",
      "any.required": "Foto ID gereklidir",
    }),
});

// User ID params validation
export const userIdParamsSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Geçersiz kullanıcı ID formatı",
      "any.required": "Kullanıcı ID gereklidir",
    }),
});

// Create photo body validation
export const createPhotoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Başlık gereklidir",
    "string.min": "Başlık en az 3 karakter olmalıdır",
    "string.max": "Başlık en fazla 100 karakter olabilir",
    "any.required": "Başlık gereklidir",
  }),

  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Açıklama en fazla 500 karakter olabilir",
  }),

  tags: Joi.alternatives()
    .try(Joi.string().trim(), Joi.array().items(Joi.string().trim()))
    .optional(),

  categories: Joi.alternatives()
    .try(
      Joi.string().trim(),
      Joi.array()
        .items(
          Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .messages({
              "string.pattern.base": "Geçersiz kategori ID formatı",
            })
        )
        .min(1)
        .max(3)
    )
    .required()
    .messages({
      "any.required": "En az 1 kategori seçmelisiniz",
      "array.min": "En az 1 kategori seçmelisiniz",
      "array.max": "En fazla 3 kategori seçebilirsiniz",
    }),
});

// Update photo body validation
export const updatePhotoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional().messages({
    "string.min": "Başlık en az 3 karakter olmalıdır",
    "string.max": "Başlık en fazla 100 karakter olabilir",
  }),

  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Açıklama en fazla 500 karakter olabilir",
  }),

  tags: Joi.alternatives()
    .try(Joi.string().trim(), Joi.array().items(Joi.string().trim()))
    .optional(),

  categories: Joi.alternatives()
    .try(
      Joi.string().trim(),
      Joi.array()
        .items(
          Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .messages({
              "string.pattern.base": "Geçersiz kategori ID formatı",
            })
        )
        .min(1)
        .max(3)
    )
    .optional()
    .messages({
      "array.min": "En az 1 kategori seçmelisiniz",
      "array.max": "En fazla 3 kategori seçebilirsiniz",
    }),
})
  .min(1)
  .messages({
    "object.min": "En az bir alan güncellenmelidir",
  });
