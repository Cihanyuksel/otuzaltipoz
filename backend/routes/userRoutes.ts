import { Router } from "express";
import {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  updateUsername,
  updatePassword,
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/restrictTo";
import upload from "../middleware/multer";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Tüm kullanıcıları listeler (Sadece admin ve moderatör erişebilir).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       403:
 *         description: Erişim yetkisi yok (sadece admin ve moderatör erişebilir).
 */
router.get("/", authenticate, restrictTo(["admin", "moderator"]), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Belirli bir kullanıcının bilgilerini getirir.
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kullanıcının ID'si.
 *         example: 60c72b1f9b1d8e0015f6b21c
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.get("/:id", getUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Yeni bir kullanıcı oluşturur. (sadece admin)
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: yeni@mail.com
 *               username:
 *                 type: string
 *                 example: yeni_kullanici
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               full_name:
 *                 type: string
 *                 example: Yeni Kullanıcı
 *               bio:
 *                 type: string
 *                 example: Fotoğraf tutkunuyum
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Geçersiz giriş veya kullanıcı adı/email zaten kullanılıyor.
 */
router.post("/", restrictTo(["admin"]), addUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Kullanıcı bilgilerini günceller (Kimlik Doğrulama Gerekir).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Güncellenecek kullanıcının ID'si.
 *         example: 60c72b1f9b1d8e0015f6b21c
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Güncellenmiş Ad
 *               bio:
 *                 type: string
 *                 example: Yeni biyografi metni
 *               profile_img:
 *                 type: string
 *                 format: binary
 *                 description: Yeni profil resmi (Opsiyonel).
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message: Profil başarıyla güncellendi
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       403:
 *         description: Bu kullanıcıyı güncelleme yetkiniz yok.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.put("/:id", authenticate, upload.single("profile_img"), updateUser);

/**
 * @swagger
 * /users/{id}/username:
 *   put:
 *     summary: Kullanıcı adını günceller. (Kimlik Doğrulama Gerekir)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kullanıcının ID'si.
 *         example: 60c72b1f9b1d8e0015f6b21c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: yeni_kullanici_adi
 *     responses:
 *       200:
 *         description: Kullanıcı adı başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Kullanıcı adı zaten kullanılıyor.
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       403:
 *         description: Bu kullanıcının adını güncelleme yetkiniz yok.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.put("/:id/username", authenticate, updateUsername);

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Kullanıcı şifresini günceller. (Kimlik Doğrulama Gerekir)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Şifresi güncellenecek kullanıcının ID'si.
 *         example: 60c72b1f9b1d8e0015f6b21c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Mevcut şifre.
 *                 example: "eskiSifre123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Yeni şifre.
 *                 example: "yeniSifre456"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Yeni şifre tekrarı.
 *                 example: "yeniSifre456"
 *     responses:
 *       200:
 *         description: Şifre başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password successfully updated"
 *       400:
 *         description: Eksik alan, şifre uyuşmazlığı veya kısa şifre hatası.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New passwords do not match"
 *       401:
 *         description: Mevcut şifre hatalı.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect"
 *       403:
 *         description: Kullanıcının kendi dışında bir hesabı güncelleme yetkisi yok.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You can only update your own password"
 *       404:
 *         description: Kullanıcı bulunamadı.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.put("/:id/password", authenticate, updatePassword);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Bir kullanıcıyı siler. (Kimlik Doğrulama Gerekir)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Silinecek kullanıcının ID'si.
 *         example: 60c72b1f9b1d8e0015f6b21c
 *     responses:
 *       204:
 *         description: Kullanıcı başarıyla silindi (İçerik yok).
 *       200:
 *         description: Kullanıcı başarıyla silindi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Kullanıcı başarıyla silindi.
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       403:
 *         description: Bu kullanıcıyı silme yetkiniz yok.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.delete("/:id", authenticate, deleteUser);

export default router;
