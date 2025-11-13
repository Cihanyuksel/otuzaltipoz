/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 690cfa00924e7a1f76fc35e0
 *           description: Kullanıcının benzersiz ID'si.
 *         username:
 *           type: string
 *           example: test
 *           description: Kullanıcı adı (benzersiz).
 *         full_name:
 *           type: string
 *           example: test test
 *           description: Kullanıcının tam adı.
 *         email:
 *           type: string
 *           example: test1@mail.com
 *           description: Kullanıcının e-posta adresi.
 *         role:
 *           type: string
 *           example: user
 *           description: Kullanıcının sistemdeki rolü.
 *         profile_img_url:
 *           type: string
 *           example: https://cloudinary.com/...
 *           description: Kullanıcının profil fotoğrafı URL'si.
 *         is_active:
 *           type: boolean
 *           example: false
 *           description: Hesabın aktif olup olmadığı.
 *         is_verified:
 *           type: boolean
 *           example: false
 *           description: Hesabın email onayı alıp almadığı.
 *     PhotoOwner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 690cfa00924e7a1f76fc35e0
 *           description: Kullanıcının benzersiz ID'si.
 *         username:
 *           type: string
 *           example: test
 *           description: Kullanıcı adı.
 *         profile_img_url:
 *           type: string
 *           example: https://res.cloudinary.com/dum8ifdql/image/upload/v1762508631/photos_app/profiles/xxdjeqx3bctoscw9zgmn.jpg
 *           description: Kullanıcının profil fotoğrafı URL'si.
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2025-11-03T11:14:19.145Z
 *           description: Fotoğrafın oluşturulma tarihi
 */
