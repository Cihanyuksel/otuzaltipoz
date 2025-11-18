import { config } from "./config";

// Production address
const prodOrigins = [
  config.client.url,
  "https://www.otuzaltipoz.com",
  "https://api.otuzaltipoz.com",
];

// Local address
const devOrigins = [
  "http://localhost:3000",
  "http://localhost:4001",
  "http://localhost:5173",
];

const allowedOrigins = [...prodOrigins, ...devOrigins];

console.log("✅ Aktif CORS Listesi:", allowedOrigins);

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`⛔ CORS BLOKLANDI! Gelen Origin: '${origin}'`);

    return callback(
      new Error(`CORS Hatası: '${origin}' adresine izin verilmiyor.`)
    );
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie", "Content-Range", "X-Content-Range"],
  maxAge: 3600,
};
