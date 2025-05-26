/**
 * @swagger
 * /api/purchases/update-status:
 *   post:
 *     summary: Update purchase status
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePurchaseStatusDto'
 *     responses:
 *       200:
 *         description: Purchase status updated
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
 *                     - $ref: '#/components/schemas/PurchaseResponseDto'
 *                     - type: object
 *                       properties:
 *                         purchase:
 *                           $ref: '#/components/schemas/PurchaseResponseDto'
 *                         details:
 *                           type: array
 *                           items:
 *                             type: object
 *                         message:
 *                           type: string
 *       400:
 *         description: Invalid status or cannot update status due to business rules
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
