/**
 * @swagger
 * /api/quotations/update-status:
 *   post:
 *     summary: Update quotation status
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuotationStatusDto'
 *     responses:
 *       200:
 *         description: Quotation status updated
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
 *                   oneOf:
 *                     - $ref: '#/components/schemas/QuotationResponseDto'
 *                     - type: object
 *                       properties:
 *                         quotation:
 *                           $ref: '#/components/schemas/QuotationResponseDto'
 *                         details:
 *                           type: array
 *                           items:
 *                             type: object
 *                         message:
 *                           type: string
 *       400:
 *         description: Invalid status or cannot update status due to business rules
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
