/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           example: "691471dc82dbe0f1bc477ea7"
 *         photo_id:
 *           type: string
 *           example: "690dbf2a5e0becc0b961ca4d"
 *         _id:
 *           type: string
 *           example: "6914971d3fd5422c3b7ed1a5"
 *         created_at:
 *           type: string
 *           example: "2025-11-12T14:18:05.167Z"
 *         __v:
 *           type: integer
 *           example: 0
 *
 *     LikeAddedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Photo liked successfully."
 *         like:
 *           $ref: '#/components/schemas/Like'
 *         isLikedByMe:
 *           type: boolean
 *           example: true
 *         likeCount:
 *           type: integer
 *           example: 2
 *
 *     LikeRemovedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Like removed successfully."
 *         isLikedByMe:
 *           type: boolean
 *           example: false
 *         likeCount:
 *           type: integer
 *           example: 1
 */
