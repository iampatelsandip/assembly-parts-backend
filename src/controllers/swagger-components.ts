/**
 * @swagger
 * components:
 *   schemas:
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
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     AddInventory:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 */
