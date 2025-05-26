/**
 * @swagger
 * /api/stock-movements/detail:
 *   post:
 *     summary: Get stock movement details
 *     description: Retrieve detailed information about a specific stock movement
 *     tags: [StockMovements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovementDetailDto'
 *     responses:
 *       200:
 *         description: Stock movement details
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
 *                   $ref: '#/components/schemas/StockMovementResponseDto'
 *       404:
 *         description: Stock movement not found
 *       500:
 *         description: Server error
 */
