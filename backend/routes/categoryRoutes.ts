import { Router } from "express";
import { getAllCategories } from "../controllers/categoriesController";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Tüm kategorileri listeler.
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: Kategoriler başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 14
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "68dfeb313216682ca3e2a494"
 *                       name:
 *                         type: string
 *                         example: "Analog"
 *             example:
 *               status: true
 *               total: 14
 *               data:
 *                 - _id: "68dfeb313216682ca3e2a494"
 *                   name: "Analog"
 *                 - _id: "68dfeb313216682ca3e2a491"
 *                   name: "Gece"
 *                 - _id: "68dfeb313216682ca3e2a490"
 *                   name: "Gıda"
 *                 - _id: "68dfeb313216682ca3e2a48c"
 *                   name: "Makro"
 *                 - _id: "68dfeb313216682ca3e2a487"
 *                   name: "Manzara"
 *                 - _id: "68dfeb313216682ca3e2a48b"
 *                   name: "Mimari"
 *                 - _id: "68dfeb313216682ca3e2a493"
 *                   name: "Minimal"
 *                 - _id: "68dfeb313216682ca3e2a48f"
 *                   name: "Moda"
 *                 - _id: "68dfeb313216682ca3e2a488"
 *                   name: "Portre"
 *                 - _id: "68dfeb313216682ca3e2a492"
 *                   name: "Sanat"
 *                 - _id: "68dfeb313216682ca3e2a48d"
 *                   name: "Seyahat"
 *                 - _id: "68dfeb313216682ca3e2a489"
 *                   name: "Sokak"
 *                 - _id: "68dfeb313216682ca3e2a48e"
 *                   name: "Spor"
 *                 - _id: "68dfeb313216682ca3e2a48a"
 *                   name: "Vahşi Yaşam"
 *       500:
 *         description: Sunucu hatası.
 */
router.get("/", getAllCategories);

export default router;
