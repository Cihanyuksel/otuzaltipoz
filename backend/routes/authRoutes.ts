import { Router } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import {
  forgotPasswordScheme,
  resetPasswordScheme,
} from "../validators/password.validator";
import upload from "../middleware/multer";
import {
  login,
  logout,
  refresh,
  signup,
  verifyEmail,
} from "../controllers/authController";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotPasswordController";
import { authenticate } from "../middleware/authMiddleware";
import { verifyEmailScheme } from "../validators/verifyEmail.validator";
import { validate, validateFile } from "../middleware/validate";
import { sendContactMessage } from "../controllers/contactController";

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Yeni bir kullanıcı kaydı yapar ve profil resmi yüklemeyi destekler.
 *     tags: [Auth]
 *     security: []
 *     description: |
 *       Yeni bir kullanıcı hesabı oluşturur, profil resmini (verilmişse) yükler ve veritabanına kaydeder.
 *       Kayıt başarılı olursa, kullanıcıya bir hesap doğrulama e-postası gönderilir.
 *       Test ve geliştirme ortamında kullanıcı otomatik olarak doğrulanabilir.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 description: Kullanıcının benzersiz e-posta adresi.
 *                 example: test2@mail.com
 *               username:
 *                 type: string
 *                 description: Benzersiz kullanıcı adı (yalnızca harf ve rakam).
 *                 example: test2
 *               password:
 *                 type: string
 *                 format: password
 *                 description: En az 6 karakterli şifre.
 *                 example: "123456"
 *               full_name:
 *                 type: string
 *                 description: Kullanıcının tam adı.
 *                 example: Test Kullanıcı
 *               bio:
 *                 type: string
 *                 description: Kullanıcı biyografisi (Opsiyonel).
 *                 example: Manzara fotoğrafçısı
 *               profile_img:
 *                 type: string
 *                 format: binary
 *                 description: Profil resmi dosyası (Opsiyonel).
 *     responses:
 *       201:
 *         description: Kayıt başarılı. Hesap doğrulama e-postası gönderildi veya otomatik doğrulandı (dev/test).
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Başarılı kayıt
 *                 value:
 *                   success: true
 *                   message: "Kayıt başarılı! E-postanı kontrol et ve hesabını aktifleştir."
 *                   user:
 *                     _id: "691471dc82dbe0f1bc477ea7"
 *                     username: "test2"
 *                     fullname: "Test Kullanıcı"
 *                     email: "test2@mail.com"
 *                     profile_img_url: "https://res.cloudinary.com/.../profile.jpg"
 *                     bio: "Manzara fotoğrafçısı"
 *                     role: "user"
 *                     is_active: false
 *                     is_verified: false
 *                   auto_verified: true
 *                   verification_token: "d1a2b3c4d5e6f7..."
 *       400:
 *         description: Geçersiz giriş (eksik alan veya hatalı format).
 *         content:
 *           application/json:
 *             examples:
 *               missing_fields:
 *                 summary: Eksik alan
 *                 value:
 *                   success: false
 *                   message: "Tüm alanlar zorunludur."
 *               invalid_email:
 *                 summary: Geçersiz e-posta
 *                 value:
 *                   success: false
 *                   message: "Geçerli bir email adresi giriniz."
 *               weak_password:
 *                 summary: Zayıf şifre
 *                 value:
 *                   success: false
 *                   message: "Şifre en az 6 karakter olmalıdır."
 *       409:
 *         description: Email veya kullanıcı adı zaten kullanılıyor.
 *         content:
 *           application/json:
 *             examples:
 *               duplicate:
 *                 summary: Benzersiz alan hatası
 *                 value:
 *                   success: false
 *                   message: "Bu email zaten kullanılıyor."
 *       500:
 *         description: Sunucu veya profil resmi yükleme hatası.
 *         content:
 *           application/json:
 *             examples:
 *               server_error:
 *                 summary: Sunucu hatası
 *                 value:
 *                   success: false
 *                   message: "Sunucu hatası"
 */
router.post(
  "/signup",
  upload.single("profile_img"),
  validateFile({
    required: false,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    maxSize: 1 * 1024 * 1024,
  }),
  validate({ body: signupSchema }),
  signup
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi yapar ve erişim token'ı döndürür.
 *     tags: [Auth]
 *     security: []
 *     description: |
 *       Kullanıcı email ve şifre ile giriş yapar. Giriş başarılı olursa access token döndürülür
 *       ve refresh token cookie olarak ayarlanır.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Kullanıcının kayıtlı e-posta adresi.
 *                 example: test2@mail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Kullanıcının şifresi.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Giriş başarılı. Access token döndürülür.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Başarılı giriş
 *                 value:
 *                   success: true
 *                   message: "✅ Başarıyla giriş yaptınız. Yönlendiriliyorsunuz…"
 *                   data:
 *                     user:
 *                       _id: "691471dc82dbe0f1bc477ea7"
 *                       username: "test2"
 *                       full_name: "Test Kullanıcı"
 *                       email: "test2@mail.com"
 *                       role: "user"
 *                       profile_img_url: "https://res.cloudinary.com/.../profile.jpg"
 *                       is_active: true
 *                     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Eksik alanlar.
 *         content:
 *           application/json:
 *             examples:
 *               missing_fields:
 *                 summary: Eksik alan
 *                 value:
 *                   success: false
 *                   message: "Email ve şifre gereklidir."
 *       401:
 *         description: Email veya şifre hatalı.
 *         content:
 *           application/json:
 *             examples:
 *               invalid_credentials:
 *                 summary: Hatalı giriş
 *                 value:
 *                   success: false
 *                   message: "Email veya şifre hatalı. Lütfen tekrar deneyin."
 *       403:
 *         description: Hesap doğrulanmamış.
 *         content:
 *           application/json:
 *             examples:
 *               not_verified:
 *                 summary: Hesap doğrulanmamış
 *                 value:
 *                   success: false
 *                   message: "Hesabınız henüz aktifleştirilmemiş. Lütfen e-postanızı kontrol edin."
 *       500:
 *         description: Sunucu hatası.
 *         content:
 *           application/json:
 *             examples:
 *               server_error:
 *                 summary: Sunucu hatası
 *                 value:
 *                   success: false
 *                   message: "Server error"
 */
router.post("/login", validate({ body: loginSchema }), login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Kullanıcının oturumunu sonlandırır.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarıyla çıkış yapıldı.
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
 *                   example: "Logged out successfully"
 *       400:
 *         description: Refresh Token çerezi bulunamadı.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Refresh Token cookie not found"
 */
router.post("/logout", authenticate, logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Yeni bir Access Token alır.
 *     tags: [Auth]
 *     security: []
 *     description: |
 *       Kullanıcının refresh token çerezi geçerliyse yeni bir access token ve güncel kullanıcı bilgilerini döndürür.
 *       Refresh token çerezi HTTP Only olarak tarayıcıda saklanmalıdır.
 *     responses:
 *       200:
 *         description: Yeni access token başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Başarılı
 *                 value:
 *                   success: true
 *                   messsage: "Access token yenilendi"
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   user:
 *                     _id: "691471dc82dbe0f1bc477ea7"
 *                     username: "test2"
 *                     fullname: "Güncellenmiş Ad YYYY"
 *                     email: "test2@mail.com"
 *                     role: "user"
 *                     profile_img_url: "https://res.cloudinary.com/.../profile.jpg"
 *                     is_active: true
 *       401:
 *         description: Refresh token çerezi eksik veya device ID eksik.
 *         content:
 *           application/json:
 *             examples:
 *               missing_refresh:
 *                 summary: Çerez eksik
 *                 value:
 *                   success: false
 *                   message: "Oturum süresi dolmuş. Lütfen tekrar giriş yapın."
 *               missing_device:
 *                 summary: Device ID eksik
 *                 value:
 *                   success: false
 *                   message: "Device ID is missing"
 *       403:
 *         description: Geçersiz veya süresi dolmuş refresh token.
 *         content:
 *           application/json:
 *             examples:
 *               invalid_token:
 *                 summary: Token geçersiz veya süresi dolmuş
 *                 value:
 *                   success: false
 *                   message: "Token expired or invalid"
 *       404:
 *         description: Kullanıcı bulunamadı.
 *         content:
 *           application/json:
 *             examples:
 *               user_not_found:
 *                 summary: Kullanıcı bulunamadı
 *                 value:
 *                   success: false
 *                   message: "User not found"
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Şifre sıfırlama e-postası gönderir.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ornek@mail.com
 *     responses:
 *       200:
 *         description: Şifre sıfırlama e-postası gönderildi.
 *       400:
 *         description: Geçersiz email veya kullanıcı bulunamadı.
 */
router.post(
  "/forgot-password",
  validate({ body: forgotPasswordScheme }),
  forgotPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Şifreyi sıfırlar.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - passwordConfirm
 *             properties:
 *               token:
 *                 type: string
 *                 description: Şifre sıfırlama token'ı.
 *                 example: abc123token456
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Yeni şifre.
 *                 example: "yeniSifre123"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 description: Yeni şifre tekrarı.
 *                 example: "yeniSifre123"
 *     responses:
 *       200:
 *         description: Şifre başarıyla sıfırlandı.
 *       400:
 *         description: Token geçersiz veya şifreler eşleşmiyor.
 */
router.post(
  "/reset-password",
  validate({ body: resetPasswordScheme }),
  resetPassword
);


router.get(
  "/verify-email",
  validate({ query: verifyEmailScheme }),
  verifyEmail
);

/**
 * @swagger
 * /auth/contact:
 *   post:
 *     summary: İletişim formu mesajı gönderir.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Caner Demir
 *               email:
 *                 type: string
 *                 format: email
 *                 example: caner@mail.com
 *               message:
 *                 type: string
 *                 example: API ile ilgili bir sorum var.
 *     responses:
 *       200:
 *         description: Mesaj başarıyla gönderildi.
 *       400:
 *         description: Eksik veya geçersiz alanlar.
 */
router.post("/contact", sendContactMessage);

export default router;
