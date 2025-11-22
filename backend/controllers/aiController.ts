import { Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/config";
import { IGetUserAuthInfoRequest } from "./authController";
import { AppError } from "../utils/AppError";
import User from "../models/User";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey as string);

export const analyzeImage = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("Kullanıcı doğrulaması yapılamadı.", 401));
    }

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return next(new AppError("Kullanıcı bulunamadı.", 404));
    }

    const today = new Date();
    const todayString = today.toDateString();
    const lastUsageDateString = currentUser.last_ai_usage_date
      ? new Date(currentUser.last_ai_usage_date).toDateString()
      : null;

    if (lastUsageDateString !== todayString) {
      currentUser.daily_ai_usage_count = 0;
      currentUser.last_ai_usage_date = today;
    }

    if (currentUser.daily_ai_usage_count >= 20) {
      return next(
        new AppError(
          "Günlük analiz limitiniz (20) dolmuştur. Yarın tekrar deneyiniz.",
          429
        )
      );
    }

    const { imageUrl, prompt } = req.body;

    if (prompt && prompt.trim().length > 250) {
      return next(new AppError("Soru en fazla 250 karakter olabilir.", 400));
    }

    if (!imageUrl) {
      return res.status(400).json({
        status: "fail",
        message: "Lütfen bir görsel URL'i gönderin.",
      });
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Resim indirilemedi: ${imageResponse.statusText}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const userPrompt =
      prompt ||
      "Bu fotoğrafı fotoğrafçılık terimleriyle teknik olarak yorumla.";

    const result = await model.generateContent([
      userPrompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    currentUser.daily_ai_usage_count += 1;
    currentUser.last_ai_usage_date = new Date();
    await currentUser.save();

    res.status(200).json({
      status: "success",
      data: {
        analysis: text,
        remaining_credits: 20 - currentUser.daily_ai_usage_count,
      },
    });
  } catch (error) {
    next(error);
  }
};
