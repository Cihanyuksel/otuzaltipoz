import express, {type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import photoRouter from "./routes/photoRoutes";


dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*"
  }));
app.use(cookieParser());

// Routes
app.use("/api/v1", userRouter); 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", photoRouter);

export default app;