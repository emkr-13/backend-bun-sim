/**
 * @swagger
 * /api/dashboard/summary-specific:
 *   get:
 *     summary: Get specific summary data with time filters
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: time_filter
 *         schema:
 *           type: string
 *           enum: [today, last_week, last_two_weeks, this_month]
 *         description: Time filter for summary data
 *     responses:
 *       200:
 *         description: Specific summary data retrieved successfully
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
 *                   $ref: '#/components/schemas/SummarySpecificDto'
 *       400:
 *         description: Invalid filter
 *       500:
 *         description: Server error
 */
