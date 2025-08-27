import Joi from "joi";

export const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(15).required(),
  full_name: Joi.string().min(3).max(15).required(),
  role: Joi.string().valid("user", "admin", "moderator").default("user"),
  is_active: Joi.boolean().default(false),
  profile_img_url: Joi.string().uri().optional(),
});

