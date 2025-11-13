import { Router } from "express";
import {
  getAllPhotos,
  getPhoto,
  createPhoto,
  deletePhoto,
  updatePhoto,
  getPhotoByUserId,
  getLikedPhotos,
  getPopularPhotos,
} from "../controllers/photoController";
import {
  getAllPhotosQuerySchema,
  getPopularPhotosQuerySchema,
  photoIdParamsSchema,
  userIdParamsSchema,
  createPhotoSchema,
  updatePhotoSchema,
} from "../validators/photo.validator";
import upload from "../middleware/multer";
import { authenticate } from "../middleware/authMiddleware";
import { authenticateOptional } from "../middleware/optionalAuth";
import { validate, validateFile } from "../middleware/validate";

const router = Router();

/**
 * @swagger
 * /photos/popular:
 *   get:
 *     summary: Popüler fotoğrafları listeler (puanlama veya beğeni bazlı).
 *     tags: [Photos]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına düşen fotoğraf sayısı.
 *     responses:
 *       200:
 *         description: Popüler fotoğraflar başarıyla getirildi.
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
 *                     $ref: '#/components/schemas/Photo'
 *       400:
 *         description: Geçersiz sorgu parametreleri.
 */
router.get(
  "/popular",
  validate({ query: getPopularPhotosQuerySchema }),
  getPopularPhotos
);

/**
 * @swagger
 * /photos/liked/{userId}:
 *   get:
 *     summary: Belirli bir kullanıcı tarafından beğenilen fotoğrafları listeler.
 *     tags: [Photos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Beğenilen fotoğrafları listelenecek kullanıcının ID'si.
 *         example: 68d57d0b0157f4a80003bdac
 *     responses:
 *       200:
 *         description: Beğenilen fotoğraflar başarıyla getirildi.
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
 *                     $ref: '#/components/schemas/Photo'
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.get(
  "/liked/:userId",
  authenticateOptional,
  validate({ params: userIdParamsSchema }),
  getLikedPhotos
);

/**
 * @swagger
 * /photos:
 *   get:
 *     summary: Tüm fotoğrafları listeler (sayfalama ve filtreleme destekli).
 *     tags: [Photos]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Sayfa başına düşen fotoğraf sayısı.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Mevcut sayfa numarası.
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Kategori adına göre filtreleme.
 *     responses:
 *       200:
 *         description: Fotoğraflar başarıyla listelendi.
 *         content:
 *           application/json:
 *             example:
 *               totalRecords: 14
 *               currentRecords: 2
 *               status: true
 *               data:
 *                 - _id: "690dbf2a5e0becc0b961ca4d"
 *                   photo_url: "https://res.cloudinary.com/dum8ifdql/image/upload/v1762508586/photos_app/mshjoz60bnhfggqyhzrk.jpg"
 *                   title: "test2"
 *                   description: "test2test2"
 *                   tags:
 *                     - "deneme1"
 *                     - "deneme2"
 *                     - "deneme3"
 *                   categories:
 *                     - _id: "68dfeb313216682ca3e2a491"
 *                       name: "Gece"
 *                     - _id: "68dfeb313216682ca3e2a48c"
 *                       name: "Makro"
 *                     - _id: "68dfeb313216682ca3e2a493"
 *                       name: "Minimal"
 *                   created_at: "2025-11-07T09:43:06.949Z"
 *                   updated_at: "2025-11-07T09:43:23.069Z"
 *                   user:
 *                     _id: "690cfa00924e7a1f76fc35e0"
 *                     username: "test"
 *                     email: "test1@gmail.com"
 *                     created_at: "2025-11-06T19:41:52.344Z"
 *                     profile_img_url: "https://res.cloudinary.com/dum8ifdql/image/upload/v1762508631/photos_app/profiles/xxdjeqx3bctoscw9zgmn.jpg"
 *                   likeCount: 1
 *                   isLikedByMe: false
 *                   averageRating: 0
 *                   totalVotes: 0
 *                 - _id: "690ce881924e7a1f76fc3557"
 *                   photo_url: "https://res.cloudinary.com/dum8ifdql/image/upload/v1762453633/photos_app/zszzlptzdkvsjv3auktv.jpg"
 *                   title: "deneme 13"
 *                   description: "deneme 13 deneme 13"
 *                   tags:
 *                     - "deneme1"
 *                     - "deneme2"
 *                     - "deneme3"
 *                   categories:
 *                     - _id: "68dfeb313216682ca3e2a487"
 *                       name: "Manzara"
 *                   created_at: "2025-11-06T18:27:13.467Z"
 *                   updated_at: "2025-11-06T18:27:13.468Z"
 *                   user:
 *                     _id: "68d57d0b0157f4a80003bdac"
 *                     username: "cihanyüksel"
 *                     email: "cihanyyuksel@gmail.com"
 *                     created_at: "2025-09-25T17:34:03.503Z"
 *                   likeCount: 0
 *                   isLikedByMe: false
 *                   averageRating: 5
 *                   totalVotes: 1
 *       400:
 *         description: Geçersiz sorgu parametreleri.
 */
router.get(
  "/",
  authenticateOptional,
  validate({ query: getAllPhotosQuerySchema }),
  getAllPhotos
);

/**
 * @swagger
 * /photos/user/{userId}:
 *   get:
 *     summary: Belirli bir kullanıcının yüklediği tüm fotoğrafları listeler.
 *     tags: [Photos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Fotoğrafları getirilecek kullanıcının ID'si.
 *         example: 68d57d0b0157f4a80003bdac
 *     responses:
 *       200:
 *         description: Kullanıcının fotoğrafları başarıyla getirildi.
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
 *                     $ref: '#/components/schemas/Photo'
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.get(
  "/user/:userId",
  authenticateOptional,
  validate({ params: userIdParamsSchema }),
  getPhotoByUserId
);

/**
 * @swagger
 * /photos/{id}:
 *   get:
 *     summary: Belirli bir fotoğrafı ID'si ile getirir.
 *     tags: [Photos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Fotoğrafın ID'si.
 *         example: 690dbf2a5e0becc0b961ca4d
 *     responses:
 *       200:
 *         description: Fotoğraf başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Photo'
 *       404:
 *         description: Fotoğraf bulunamadı.
 */
router.get("/:id", validate({ params: photoIdParamsSchema }), getPhoto);

/**
 * @swagger
 * /photos/upload:
 *   post:
 *     summary: Yeni bir fotoğraf yükler. (Kimlik Doğrulama Gerekir)
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - photo
 *             properties:
 *               title:
 *                 type: string
 *                 description: Fotoğrafın başlığı.
 *                 example: Gün Batımı Manzarası
 *               description:
 *                 type: string
 *                 description: Fotoğrafın açıklaması (Opsiyonel).
 *                 example: Ege kıyısından çekilmiş muhteşem bir gün batımı.
 *               category:
 *                 type: string
 *                 description: Fotoğrafın ait olduğu kategori ID'si.
 *                 example: 60c72b1f9b1d8e0015f6b21d
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Yüklenecek fotoğraf dosyası.
 *     responses:
 *       201:
 *         description: Fotoğraf başarıyla yüklendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Photo'
 *       401:
 *         description: Kimlik doğrulaması başarısız.
 *       400:
 *         description: Geçersiz giriş veya dosya limiti aşıldı.
 */
router.post(
  "/upload",
  authenticate,
  upload.single("photo"),
  validateFile({
    required: true,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    maxSize: 5 * 1024 * 1024,
  }),
  validate({ body: createPhotoSchema }),
  createPhoto
);

/**
 * @swagger
 * /photos/{id}:
 *   put:
 *     summary: Belirli bir fotoğrafın başlığını, açıklamasını veya etiketlerini günceller. (Kimlik Doğrulama Gerekir)
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Güncellenecek fotoğrafın ID'si.
 *         example: 6914f9e96f214ee278b96e9a
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Yeni başlık (Opsiyonel).
 *                 example: Yeni Başlık
 *               description:
 *                 type: string
 *                 description: Yeni açıklama (Opsiyonel).
 *                 example: Güncellenmiş açıklama metni.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Yeni etiket listesi (Opsiyonel).
 *                 example: ["doğa", "gezi", "fotoğraf"]
 *     responses:
 *       200:
 *         description: Fotoğraf başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example:
 *                     _id: "6914f9e96f214ee278b96e9a"
 *                     user_id: "691471dc82dbe0f1bc477ea7"
 *                     photo_url: "https://res.cloudinary.com/dum8ifdql/image/upload/v1762982377/test/photos_app/s5c1fo4fcyh95jnek8hq.jpg"
 *                     title: "deneme143"
 *                     description: "deneme14 deneme14"
 *                     tags:
 *                       - "deneme1"
 *                       - "deneme2"
 *                       - "deneme3"
 *                     categories:
 *                       - "68dfeb313216682ca3e2a493"
 *                     created_at: "2025-11-12T21:19:37.977Z"
 *                     updated_at: "2025-11-12T21:19:50.572Z"
 *                     __v: 0
 *       400:
 *         description: Geçersiz istek veya eksik alanlar.
 *       401:
 *         description: Yetkilendirme başarısız.
 *       403:
 *         description: Kullanıcının bu fotoğrafı güncelleme yetkisi yok.
 *       404:
 *         description: Fotoğraf bulunamadı.
 */
router.put(
  "/:id",
  authenticate,
  validate({
    params: photoIdParamsSchema,
    body: updatePhotoSchema,
  }),
  updatePhoto
);

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Belirli bir fotoğrafı siler. (Kimlik Doğrulama Gerekir)
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Silinecek fotoğrafın ID'si.
 *         example: 60c72b1f9b1d8e0015f6b21e
 *     responses:
 *       204:
 *         description: Fotoğraf başarıyla silindi (İçerik yok).
 *       200:
 *         description: Fotoğraf başarıyla silindi.
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
 *                   example: Fotoğraf başarıyla silindi.
 *       401:
 *         description: Yetkilendirme başarısız.
 *       403:
 *         description: Kullanıcının bu fotoğrafı silme yetkisi yok.
 *       404:
 *         description: Fotoğraf bulunamadı.
 */
router.delete(
  "/:id",
  authenticate,
  validate({ params: photoIdParamsSchema }),
  deletePhoto
);

export default router;
