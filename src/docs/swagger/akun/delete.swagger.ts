/**
 * @swagger
 * /api/akun/delete:
 *   post:
 *     summary: Delete an account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteAkunDto'
 *     responses:
 *       200:
 *         description: Account deleted successfully
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
 *         description: Account not found
 *       500:
 *         description: Server error
 */
