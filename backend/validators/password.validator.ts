import Joi from "joi";

// ==================== FORGOT PASSWORD SCHEMA ====================
export const forgotPasswordScheme = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.empty": "Email adresi gereklidir",
    "string.email": "Geçerli bir email adresi giriniz",
    "any.required": "Email adresi gereklidir",
  }),
}).options({ stripUnknown: true });

// ==================== RESET PASSWORD SCHEMA ====================
export const resetPasswordScheme = Joi.object({
  token: Joi.string().length(64).required().messages({
    "string.empty": "Sıfırlama tokeni gereklidir",
    "string.length": "Geçersiz token formatı",
    "any.required": "Sıfırlama tokeni gereklidir",
  }),

  password: Joi.string().min(6).max(128).required().messages({
    "string.empty": "Yeni şifre gereklidir",
    "string.min": "Şifre en az 6 karakter olmalıdır",
    "string.max": "Şifre en fazla 128 karakter olabilir",
    "any.required": "Yeni şifre gereklidir",
  }),

  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Şifreler eşleşmiyor",
      "string.empty": "Şifre tekrarı gereklidir",
      "any.required": "Şifre tekrarı gereklidir",
    }),
}).options({ stripUnknown: true });

// ==================== RESEND VERIFICATION EMAIL SCHEMA ====================
export const resendVerificationScheme = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.empty": "Email adresi gereklidir",
    "string.email": "Geçerli bir email adresi giriniz",
    "any.required": "Email adresi gereklidir",
  }),
}).options({ stripUnknown: true });
