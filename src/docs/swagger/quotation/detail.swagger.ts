/**
 * @swagger
 * /api/quotations/detail:
 *   post:
 *     summary: Get quotation by ID
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuotationDetailDto'
 *     responses:
 *       200:
 *         description: Quotation details
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
 *                   $ref: '#/components/schemas/QuotationDetailResponseDto'
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
