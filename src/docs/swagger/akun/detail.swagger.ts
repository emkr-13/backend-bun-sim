/**
 * @swagger
 * /api/akun/detail:
 *   post:
 *     summary: Get account details
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AkunDetailDto'
 *     responses:
 *       200:
 *         description: Account found
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
 *                   $ref: '#/components/schemas/AkunResponseDto'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */ 