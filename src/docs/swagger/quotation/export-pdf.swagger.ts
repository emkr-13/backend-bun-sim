/**
 * @swagger
 * /api/quotations/export-pdf:
 *   post:
 *     summary: Export quotation to PDF
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
 *         description: Quotation PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *             description: PDF file containing the quotation details
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
