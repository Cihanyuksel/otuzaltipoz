import { config } from "./config";

const prodOrigins = [config.client.url, config.client.swagger];
const devOrigins = ["http://localhost:3000", "http://localhost:4001"];

const allowedOrigins =
  config.node_env === "production"
    ? prodOrigins
    : [...prodOrigins, ...devOrigins];

console.log("PROD: ", prodOrigins);
console.log("DEV: ", devOrigins);
export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin && config.node_env !== "production") {
      return callback(null, true);
    }

    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("CORS Hatası: Bu kaynağa (origin) izin verilmiyor.")
    );
  },
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
};
