/**
 * @swagger
 * components:
 *   schemas:
 *     Photo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 690dbf2a5e0becc0b961ca4d
 *           description: Fotoğrafın benzersiz ID'si
 *         title:
 *           type: string
 *           example: deneme 1
 *           description: Fotoğrafın başlığı
 *         description:
 *           type: string
 *           example: deneme 1 deneme 1
 *           description: Fotoğrafın açıklaması
 *         photo_url:
 *           type: string
 *           example: https://res.cloudinary.com/dum8ifdql/image/upload/v1762247447/photos_app/njy1df6v0ofnv0jumhqc.jpg
 *           description: Fotoğrafın URL'si
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["deneme1", "deneme2", "deneme3"]
 *           description: Fotoğrafa eklenmiş etiketler
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         user:
 *             $ref: '#/components/schemas/PhotoOwner'
 *         likeCount:
 *           type: integer
 *           example: 2
 *           description: Fotoğrafın aldığı beğeni sayısı
 *         commentCount:
 *           type: integer
 *           example: 0
 *           description: Fotoğrafa yapılan yorum sayısı
 *         popularityScore:
 *           type: integer
 *           example: 2
 *           description: Fotoğrafın popülerlik puanı
 *         isLikedByMe:
 *           type: boolean
 *           example: false
 *           description: Kullanıcının fotoğrafı beğenip beğenmediği
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2025-11-04T09:10:48.516Z
 *           description: Fotoğrafın oluşturulma tarihi
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2025-11-04T09:10:48.517Z
 *           description: Fotoğrafın güncellenme tarihi
 */







