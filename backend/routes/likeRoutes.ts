import { Router } from "express";
import { getPhotoLikes, toggleLike } from "../controllers/likeController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /photos/{photoId}/toggle-like:
 *   post:
 *     summary: Bir fotoğrafı beğenir veya beğeniyi kaldırır. (Kimlik Doğrulama Gerekir)
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Beğenilecek/Beğenisi kaldırılacak fotoğrafın ID'si.
 *     responses:
 *       200:
 *         description: İşlem başarılı. (Beğenildi veya Beğeni kaldırıldı)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/LikeAddedResponse'
 *                 - $ref: '#/components/schemas/LikeRemovedResponse'
 *       401:
 *         description: Yetkilendirme başarısız (Token eksik veya geçersiz).
 *       404:
 *         description: Fotoğraf bulunamadı.
 */
router.post("/:photoId/toggle-like", authenticate, toggleLike);

/**
 * @swagger
 * /photos/{photoId}/likes:
 *   get:
 *     summary: Bir fotoğrafın toplam beğeni sayısını ve kullanıcı bilgilerini getirir. (Kimlik Doğrulama Gerekir)
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Beğeni bilgisi getirilecek fotoğrafın ID'si.
 *         example: 6914f9e96f214ee278b96e9a
 *     responses:
 *       200:
 *         description: Beğeni bilgisi başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 photoId:
 *                   type: string
 *                   example: "6914f9e96f214ee278b96e9a"
 *                 likeCount:
 *                   type: integer
 *                   example: 1
 *                 isLikedByMe:
 *                   type: boolean
 *                   example: true
 *                 usersWhoLiked:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "691471dc82dbe0f1bc477ea7"
 *                       username:
 *                         type: string
 *                         example: "test2"
 *                       role:
 *                         type: string
 *                         example: "user"
 *             example:
 *               photoId: "6914f9e96f214ee278b96e9a"
 *               likeCount: 1
 *               isLikedByMe: true
 *               usersWhoLiked:
 *                 - _id: "691471dc82dbe0f1bc477ea7"
 *                   username: "test2"
 *                   role: "user"
 *       401:
 *         description: Yetkilendirme başarısız.
 *       404:
 *         description: Fotoğraf bulunamadı.
 */
router.get("/:photoId/likes", authenticate, getPhotoLikes);

export default router;
