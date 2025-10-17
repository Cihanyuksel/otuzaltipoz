import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { AppError } from "../utils/AppError";

// ==================== TYPE DEFINITIONS ====================
interface RequestValidationSchema {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}

interface FileValidationOptions {
  required?: boolean;
  allowedTypes?: string[];
  maxSize?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const validate = (schema: RequestValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationSchema = Joi.object({
      body: schema.body || Joi.object().unknown(true),
      query: schema.query || Joi.object().unknown(true),
      params: schema.params || Joi.object().unknown(true),
    });

    const { error, value } = validationSchema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {
      const errorMessages = error.details.map((detail) => {
        const field = detail.path.join(".");
        return `${field}: ${detail.message}`;
      });
      return next(new AppError(errorMessages.join(", "), 400));
    }

    if (schema.body) {
      (req as any).validatedBody = value.body;
    }
    if (schema.query) {
      (req as any).validatedQuery = value.query;
    }
    if (schema.params) {
      (req as any).validatedParams = value.params;
    }

    next();
  };
};

// ==================== FILE VALIDATION ====================
export const validateFile = (options: FileValidationOptions = {}) => {
  const {
    required = false,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    maxSize = 5 * 1024 * 1024,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (required && !req.file) {
      return next(new AppError("Dosya yükleme zorunludur", 400));
    }

    if (!req.file) {
      return next();
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(
        new AppError(
          `Geçersiz dosya tipi. İzin verilen formatlar: ${allowedTypes
            .map((type) => type.split("/")[1].toUpperCase())
            .join(", ")}`,
          400
        )
      );
    }

    if (req.file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return next(
        new AppError(
          `Dosya boyutu çok büyük. Maksimum ${maxSizeMB}MB olabilir`,
          400
        )
      );
    }

    next();
  };
};
