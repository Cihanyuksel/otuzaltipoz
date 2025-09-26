import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: "Too many login attempts, please try again later.",
});
