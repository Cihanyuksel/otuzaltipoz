import express, {type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes"; // router dosyasını import et
import authRouter from "./routes/authRoutes"; // router dosyasını import et

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*" // tüm domainlere izin verir, güvenli değil ama test için yeterli
  }));
app.use(cookieParser());

app.use("/api/v1", userRouter); 
app.use("/api/auth", authRouter);



export default app;