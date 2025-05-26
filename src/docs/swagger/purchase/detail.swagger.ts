/**
 * @swagger
 * /api/purchases/detail:
 *   post:
 *     summary: Get purchase by ID
 *     tags: [Purchase]
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
 *         description: Purchase details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PurchaseDetailResponseDto'
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
