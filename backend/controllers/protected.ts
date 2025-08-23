import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const protectedRoute = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    jwt.verify(token, ACCESS_TOKEN_SECRET);
    res.json({ message: "Access granted" });
  } catch (err) {
    res.status(401).json({ message: "Token expired or invalid" });
  }
};