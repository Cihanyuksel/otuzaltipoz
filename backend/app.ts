//third-party
import dotenv from "dotenv";
dotenv.config();
import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
//routes and limiter
import {
  maxRefreshTokenRotations,
  maxForgetPasswordRotations,
  maxLoginRotations,
  maxContactRotations,
} from "./middleware/authLimiter";
import {
  authRouter,
  categoryRouter,
  commentRouter,
  likeRouter,
  photoRouter,
  ratingRouter,
  userRouter,
} from "./routes";
//middleware and config
import { globalErrorHandler } from "./middleware/errorHandler";
import { config } from "./config/config";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

//rate-limiter
if (config.node_env === "production") {
  app.use("/api/v1/auth/refresh", maxRefreshTokenRotations);
  app.use("/api/v1/auth/login", maxLoginRotations);
  app.use("/api/v1/auth/forgot-password", maxForgetPasswordRotations);
  app.use("/api/v1/auth/contact", maxContactRotations);
}

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/photos", photoRouter);
app.use("/api/v1/photos", commentRouter);
app.use("/api/v1/photos", likeRouter);
app.use("/api/v1/photos", ratingRouter);
app.use("/api/v1/categories", categoryRouter);

//error handler
app.use(globalErrorHandler);

export default app;
