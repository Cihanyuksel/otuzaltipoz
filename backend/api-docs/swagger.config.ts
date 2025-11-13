import { config } from "../config/config";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Otuzaltıpoz API",
      version: "1.0.0",
      description: "RESTful fotoğraf, kullanıcı ve yorum yönetim APIsi.",
      contact: {
        name: "Cihan Yüksel",
        email: "contact@otuzaltipoz.com",
      },
      license: {
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: config.server.url,
        description: `${config.node_env} ortamı`,
      },
    ],

    components: {
      schemas: {},
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./routes/authRoutes.ts",
    "./routes/userRoutes.ts",
    "./routes/photoRoutes.ts",
    "./routes/commentRoutes.ts",
    "./routes/likeRoutes.ts",
    "./routes/ratingRoutes.ts",
    "./routes/categoryRoutes.ts",
    "./api-docs/schemas/*.ts",
  ],
};
