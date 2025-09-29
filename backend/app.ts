import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from 'helmet';
//routes
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import photoRouter from "./routes/photoRoutes";
import commentRouter from "./routes/commentRoutes";
import likeRouter from "./routes/likeRoutes";
import ratingRouter from "./routes/ratingRoutes";
//middleware and config
import { globalErrorHandler } from "./middleware/errorHandler";
import { config } from "./config/config";
import { authLimiter } from "./middleware/authLimiter";

dotenv.config();

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
  app.use("/api/v1/auth", authLimiter);
}

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", photoRouter);
app.use("/api/v1", commentRouter);
app.use("/api/v1", likeRouter);
app.use("/api/v1", ratingRouter);

//error handler
app.use(globalErrorHandler);

export default app;
