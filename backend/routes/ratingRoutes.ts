import { Router } from "express";
import { ratePhoto, getPhotoRatings } from "../controllers/ratingController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /photos/{photoId}/rate:
 *   post:
 *     summary: Bir fotoğrafa 1-5 arası puan verir. (Kimlik Doğrulama Gerekir)
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Puanlanacak fotoğrafın ID'si.
 *         example: 6914f9e96f214ee278b96e9a
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Fotoğrafa verilecek puan (1-5 arası).
 *                 example: 5
 *     responses:
 *       200:
 *         description: Fotoğraf başarıyla oylandı veya puan güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Fotoğraf başarıyla oylandı."
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 rating:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6914fccce9c32f536bf5cdc2"
 *                     user_id:
 *                       type: string
 *                       example: "691471dc82dbe0f1bc477ea7"
 *                     photo_id:
 *                       type: string
 *                       example: "6914f9e96f214ee278b96e9a"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-12T21:31:56.909Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-12T21:31:56.909Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *             example:
 *               message: "Fotoğraf başarıyla oylandı."
 *               success: true
 *               rating:
 *                 user_id: "691471dc82dbe0f1bc477ea7"
 *                 photo_id: "6914f9e96f214ee278b96e9a"
 *                 rating: 5
 *                 created_at: "2025-11-12T21:31:56.909Z"
 *                 updated_at: "2025-11-12T21:31:56.909Z"
 *                 _id: "6914fccce9c32f536bf5cdc2"
 *                 __v: 0
 *       400:
 *         description: Geçersiz puan değeri.
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       404:
 *         description: Fotoğraf bulunamadı.
 */
router.post("/:photoId/rate", authenticate, ratePhoto);

/**
 * @swagger
 * /photos/{photoId}/ratings:
 *   get:
 *     summary: Bir fotoğrafın ortalama puanını ve toplam oy sayısını getirir. (Kimlik Doğrulama Gerekir)
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Oylama bilgileri getirilecek fotoğrafın ID'si.
 *         example: 60c72b1f9b1d8e0015f6b21e
 *     responses:
 *       200:
 *         description: Fotoğrafın oylama bilgileri başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fotoğrafın oylama bilgileri başarıyla getirildi
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     photoId:
 *                       type: string
 *                       example: 690dbf2a5e0becc0b961ca4d
 *                     averageRating:
 *                       type: number
 *                       format: float
 *                       example: 4
 *                     totalVotes:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Fotoğraf bulunamadı.
 *       500:
 *         description: Oylama bilgileri alınırken bir hata oluştu.
 */
router.get("/:photoId/ratings", authenticate, getPhotoRatings);

export default router;
