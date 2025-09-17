import express, {type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import photoRouter from "./routes/photoRoutes";
import commentRouter from "./routes/commentRoutes";
import likeRouter from "./routes/likeRoutes";
import ratingRouter from "./routes/ratingRoutes";
import { globalErrorHandler } from "./middleware/errorHandler";


dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,              
  }));
app.use(cookieParser());


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