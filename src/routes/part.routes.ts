import { Router } from 'express';
import { PartController } from '../controllers/part.controller';

const router = Router();
const partController = new PartController();
/**
 * @swagger
 * components:
 *   schemas:
 *     SubPart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         quantity:
 *           type: integer
 *     CreatePart:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [RAW, ASSEMBLED]
 *         parts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SubPart'
 *     AddInventory:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 */

/**
 * @swagger
 * /api/part:
 *   post:
 *     summary: Create a new part (RAW or ASSEMBLED)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePart'
 *     responses:
 *       201:
 *         description: Part created
 */

router.post('/part', partController.createPart);

/**
 * @swagger
 * /api/part/{partId}:
 *   post:
 *     summary: Add quantity to a part
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddInventory'
 *     responses:
 *       200:
 *         description: Inventory updated
 */

router.post('/part/:partId', partController.addInventory);
router.get('/part/:partId', partController.getPartById);
router.get('/parts', partController.getAllParts);

export { router as partRoutes };
