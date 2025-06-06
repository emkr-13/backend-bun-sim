/**
 * @swagger
 * /api/reports/combined/pdf:
 *   post:
 *     summary: Generate combined financial report as PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportFilterDto'
 *     responses:
 *       200:
 *         description: PDF report generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */ 