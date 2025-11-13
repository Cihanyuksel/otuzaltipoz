//third-party
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
import basicAuth from "express-basic-auth";
//swagger
import { swaggerOptions } from "./api-docs/swagger.config";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app: Application = express();

// BASIC MIDDLEWARE'LER
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// RATE LIMITER
if (config.node_env === "production") {
  app.use("/api/v1/auth/refresh", maxRefreshTokenRotations);
  app.use("/api/v1/auth/login", maxLoginRotations);
  app.use("/api/v1/auth/forgot-password", maxForgetPasswordRotations);
  app.use("/api/v1/auth/contact", maxContactRotations);
}

// SWAGGER SETTINGS
const swaggerRoute = "/api/v1/api-docs";
const swaggerSpecs = swaggerJSDoc(swaggerOptions);

if (config.node_env === "production") {
  const swaggerUser = config.swagger.swagger_user;
  const swaggerPass = config.swagger.swagger_password;

  if (!swaggerUser || !swaggerPass) {
    throw new Error(
      "⛔ KRİTİK HATA: Production ortamında SWAGGER_USER ve SWAGGER_PASSWORD tanımlanmamış! Uygulama güvenlik nedeniyle durduruluyor."
    );
  }

  app.use(
    swaggerRoute,
    basicAuth({
      users: {
        [swaggerUser]: swaggerPass,
      },
      challenge: true,
    })
  );
}

//SWAGGER UI
app.use(
  swaggerRoute,
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpecs, {
    swaggerOptions: {
      supportedSubmitMethods:
        config.node_env === "production"
          ? ["get"]
          : ["get", "post", "put", "delete", "patch"],
    },
    customSiteTitle: "Otuzaltıpoz API Dokümantasyonu",
  })
);

// API ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/photos", photoRouter);
app.use("/api/v1/photos", commentRouter);
app.use("/api/v1/photos", likeRouter);
app.use("/api/v1/photos", ratingRouter);
app.use("/api/v1/categories", categoryRouter);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
