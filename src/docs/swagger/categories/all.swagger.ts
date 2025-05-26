/**
 * @swagger
 * /api/categories/all:
 *   get:
 *     summary: Get list of categories
 *     tags: [Categories]
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
 *         description: Search term
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
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
 *         description: Categories retrieved successfully
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
 *                         $ref: '#/components/schemas/CategoryResponseDto'
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
