/**
 * @swagger
 * /api/purchases/export-pdf:
 *   post:
 *     summary: Export purchase to PDF
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseDetailDto'
 *     responses:
 *       200:
 *         description: Purchase PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *             description: PDF file containing the purchase details
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
