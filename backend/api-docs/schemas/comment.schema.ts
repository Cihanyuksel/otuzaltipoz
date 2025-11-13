/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "690cfa00924e7a1f76fc35e0"
 *         username:
 *           type: string
 *           example: "test"
 *         profile_img_url:
 *           type: string
 *           example: "https://res.cloudinary.com/dum8ifdql/image/upload/v1762508631/photos_app/profiles/xxdjeqx3bctoscw9zgmn.jpg"
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "69148ec865d00665985569c9"
 *         text:
 *           type: string
 *           example: "Katılıyorum!"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         photo:
 *           type: string
 *           example: "690dbf2a5e0becc0b961ca4d"
 *         parentComment:
 *           type: string
 *           nullable: true
 *           example: null
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         edit_count:
 *           type: integer
 *           example: 0
 *         is_edited:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-11-12T13:42:32.901Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-11-12T13:42:32.901Z"
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 */
