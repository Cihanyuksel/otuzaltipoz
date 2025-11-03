import Joi from "joi";

// ==================== SIGNUP SCHEMA ====================
export const signupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .trim()
    .lowercase()
    .messages({
      "string.empty": "Kullanıcı adı gereklidir",
      "string.alphanum": "Kullanıcı adı sadece harf ve rakam içerebilir",
      "string.min": "Kullanıcı adı en az 3 karakter olmalıdır",
      "string.max": "Kullanıcı adı en fazla 30 karakter olabilir",
      "any.required": "Kullanıcı adı gereklidir",
    }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .required()
    .trim()
    .lowercase()
    .messages({
      "string.empty": "Email adresi gereklidir",
      "string.email": "Geçerli bir email adresi giriniz",
      "any.required": "Email adresi gereklidir",
    }),

  password: Joi.string().min(6).max(128).required().messages({
    "string.empty": "Şifre gereklidir",
    "string.min": "Şifre en az 6 karakter olmalıdır",
    "string.max": "Şifre en fazla 128 karakter olabilir",
    "any.required": "Şifre gereklidir",
  }),

  full_name: Joi.string()
    .pattern(/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/)
    .min(3)
    .max(50)
    .required()
    .trim()
    .messages({
      "string.empty": "Ad Soyad gereklidir",
      "string.min": "Ad Soyad en az 3 karakter olmalıdır",
      "string.max": "Ad Soyad en fazla 50 karakter olabilir",
      "string.pattern.base": "Ad Soyad sadece harflerden oluşmalıdır",
      "any.required": "Ad Soyad gereklidir",
    }),

  bio: Joi.string().max(500).optional().trim().allow("").messages({
    "string.max": "Bio en fazla 500 karakter olabilir",
  }),
}).options({ stripUnknown: true });

// ==================== LOGIN SCHEMA ====================
export const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.empty": "Email adresi gereklidir",
    "string.email": "Geçerli bir email adresi giriniz",
    "any.required": "Email adresi gereklidir",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Şifre gereklidir",
    "any.required": "Şifre gereklidir",
  }),
}).options({ stripUnknown: true });
