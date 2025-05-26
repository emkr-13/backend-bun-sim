/**
 * @swagger
 * /api/quotations/all:
 *   get:
 *     summary: Get all quotations with pagination
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by quotation number or customer name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, sent, accepted, rejected, expired, converted]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [quotationNumber, quotationDate, grandTotal, status, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of quotations
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
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/QuotationResponseDto'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total_data:
 *                           type: number
 *                         total_page:
 *                           type: number
 *                         total_display:
 *                           type: number
 *                         first_page:
 *                           type: boolean
 *                         last_page:
 *                           type: boolean
 *                         prev:
 *                           type: number
 *                         current:
 *                           type: number
 *                         next:
 *                           type: number
 *                         detail:
 *                           type: array
 *                           items:
 *                             type: number
 *       500:
 *         description: Server error
 */
