/**
 * @swagger
 * /api/store/detail:
 *   post:
 *     summary: Get store details
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreDetailDto'
 *     responses:
 *       200:
 *         description: Store detail retrieved successfully
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
 *                   $ref: '#/components/schemas/StoreResponseDto'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */
