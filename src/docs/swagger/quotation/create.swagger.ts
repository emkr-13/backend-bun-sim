/**
 * @swagger
 * /api/quotations/create:
 *   post:
 *     summary: Create a new quitation
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuotationDto'
 *     responses:
 *       201:
 *         description: Quotation created successfully
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
 *                   $ref: '#/components/schemas/QuotationResponseDto'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
