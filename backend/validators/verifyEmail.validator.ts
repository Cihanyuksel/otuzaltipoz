import Joi from "joi";

export const verifyEmailScheme = Joi.object({
  token: Joi.string()
    .length(64)
    .required()
    .messages({
      "string.empty": "Doğrulama tokeni gereklidir",
      "string.length": "Geçersiz token formatı",
      "any.required": "Doğrulama tokeni gereklidir",
    }),
}).options({ stripUnknown: true });