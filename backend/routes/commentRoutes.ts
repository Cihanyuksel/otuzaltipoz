import { Router } from "express";
import {
  addComment,
  getCommentsByPhoto,
  deleteComment,
  updateComment,
} from "../controllers/commentController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /photos/comments/{photoId}:
 *   get:
 *     summary: Bir fotoğrafın tüm yorumlarını getirir. (Kimlik Doğrulama Gerekir)
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Yorumları getirilecek fotoğrafın ID'si.
 *         example: 690dbf2a5e0becc0b961ca4d
 *     responses:
 *       200:
 *         description: Yorumlar başarıyla getirildi.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "69148ec865d00665985569c9"
 *                   text: "Katılıyorum!"
 *                   user:
 *                     _id: "690cfa00924e7a1f76fc35e0"
 *                     username: "test"
 *                     profile_img_url: "https://res.cloudinary.com/dum8ifdql/image/upload/v1762508631/photos_app/profiles/xxdjeqx3bctoscw9zgmn.jpg"
 *                   photo: "690dbf2a5e0becc0b961ca4d"
 *                   parentComment: null
 *                   isDeleted: false
 *                   edit_count: 0
 *                   is_edited: false
 *                   created_at: "2025-11-12T13:42:32.901Z"
 *                   updated_at: "2025-11-12T13:42:32.901Z"
 *                   replies: []
 *                 - _id: "69148dfb65d00665985569a5"
 *                   text: "deneme"
 *                   user:
 *                     _id: "691471dc82dbe0f1bc477ea7"
 *                     username: "test2"
 *                   photo: "690dbf2a5e0becc0b961ca4d"
 *                   parentComment: null
 *                   isDeleted: false
 *                   edit_count: 0
 *                   is_edited: false
 *                   created_at: "2025-11-12T13:39:07.532Z"
 *                   updated_at: "2025-11-12T13:39:07.532Z"
 *                   replies: []
 *       404:
 *         description: Fotoğraf bulunamadı.
 */
router.get("/comments/:photoId", authenticate, getCommentsByPhoto);

/**
 * @swagger
 * /photos/comments/{photoId}:
 *   post:
 *     summary: Bir fotoğrafa yorum ekler. (Kimlik Doğrulama Gerekir)
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema:
 *           type: string
 *         example: 690dbf2a5e0becc0b961ca4d
 *         description: Yorum eklenecek fotoğrafın ID'si.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Harika bir fotoğraf!"
 *     responses:
 *       201:
 *         description: Yorum başarıyla eklendi.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "69148819075f607f181c3042"
 *                 user: "690cfa00924e7a1f76fc35e0"
 *                 photo: "68c9e750bad5dc909be39eea"
 *                 text: "Katılıyorum!"
 *                 parentComment: "68cd45b7eb0626207a420fd7"
 *                 isDeleted: false
 *                 edit_count: 0
 *                 is_edited: false
 *                 created_at: "2025-11-12T13:14:01.361Z"
 *                 updated_at: "2025-11-12T13:14:01.361Z"
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 */
router.post("/comments/:photoId", authenticate, addComment);

/**
 * @swagger
 * /photos/comments/{id}:
 *   put:
 *     summary: Bir yorumu günceller. (Kimlik Doğrulama Gerekir)
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 69148ec865d00665985569c9
 *         description: Güncellenecek yorumun ID'si.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Yorumu güncelledim."
 *     responses:
 *       200:
 *         description: Yorum başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "69148ec865d00665985569c9"
 *                 text:
 *                   type: string
 *                   example: "Yeni Yorum"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "690cfa00924e7a1f76fc35e0"
 *                     username:
 *                       type: string
 *                       example: "test"
 *                     profile_img_url:
 *                       type: string
 *                       example: "https://res.cloudinary.com/dum8ifdql/image/upload/v1762508631/photos_app/profiles/xxdjeqx3bctoscw9zgmn.jpg"
 *                 photo:
 *                   type: string
 *                   example: "690dbf2a5e0becc0b961ca4d"
 *                 parentComment:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 isDeleted:
 *                   type: boolean
 *                   example: false
 *                 edit_count:
 *                   type: integer
 *                   example: 1
 *                 is_edited:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   example: "2025-11-12T13:42:32.901Z"
 *                 updated_at:
 *                   type: string
 *                   example: "2025-11-12T14:09:17.983Z"
 *                 __v:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       404:
 *         description: Yorum bulunamadı.
 */
router.put("/comments/:id", authenticate, updateComment);

/**
 * @swagger
 * /photos/comments/{id}:
 *   delete:
 *     summary: Bir yorumu siler. (Kimlik Doğrulama Gerekir)
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 69148ec865d00665985569c9
 *         description: Silinecek yorumun ID'si.
 *     responses:
 *       200:
 *         description: Yorum başarıyla silindi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted"
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       404:
 *         description: Yorum bulunamadı.
 */
router.delete("/comments/:id", authenticate, deleteComment);

export default router;
