/**
 * @swagger
 * /api/categories/detail:
 *   post:
 *     summary: Get category details
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryDetailDto'
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
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
 *                   $ref: '#/components/schemas/CategoryResponseDto'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
