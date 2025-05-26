/**
 * @swagger
 * /api/store/delete:
 *   post:
 *     summary: Delete a store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteStoreDto'
 *     responses:
 *       200:
 *         description: Store deleted successfully
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
 *                   type: null
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */ 