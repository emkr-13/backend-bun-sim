/**
 * @swagger
 * /api/stock-movements/all:
 *   get:
 *     summary: List all stock movements
 *     description: Retrieve a list of stock movements with pagination, search, and filtering options
 *     tags: [StockMovements]
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
 *         description: Search by product name, SKU, or notes
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [in, out]
 *         description: Filter by movement type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, productName, quantity, movementType]
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
 *         description: A paginated list of stock movements
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
 *                   $ref: '#/components/schemas/StockMovementListResponseDto'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_data:
 *                       type: number
 *                     total_page:
 *                       type: number
 *                     total_display:
 *                       type: number
 *                     first_page:
 *                       type: boolean
 *                     last_page:
 *                       type: boolean
 *                     prev:
 *                       type: number
 *                     current:
 *                       type: number
 *                     next:
 *                       type: number
 *                     detail:
 *                       type: array
 *                       items:
 *                         type: number
 *       500:
 *         description: Server error
 */
