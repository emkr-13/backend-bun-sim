/**
 * @swagger
 * /api/dashboard/summary-general:
 *   get:
 *     summary: Get general summary data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: General summary data retrieved successfully
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
 *                   $ref: '#/components/schemas/SummaryGeneralDto'
 *       500:
 *         description: Server error
 */
