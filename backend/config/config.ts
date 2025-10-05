import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

dotenv.config();

type JwtExpireType = SignOptions["expiresIn"];

export const config = {
  node_env: process.env.NODE_ENV,
  server: {
    url: process.env.SERVER_URL,
    port: process.env.PORT
  },
  email: {
    smtp: {
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            username: process.env.SMTP_USER,
            password: process.env.SMTP_PASS
        }
    },
    from: process.env.MAIL_FROM
  },
  jwt: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET as string,
      expire: process.env.ACCESS_TOKEN_EXPIRE as JwtExpireType,
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET as string,
      expire: process.env.REFRESH_TOKEN_EXPIRE as JwtExpireType,
      cookie_name: process.env.REFRESH_TOKEN_COOKIE_NAME!
    }
  },
  client: {
    url: process.env.CLIENT_URL
  }
} as const
