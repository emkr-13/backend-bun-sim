/**
 * @swagger
 * components:
 *   schemas:
 *     SummaryGeneralDto:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: number
 *           description: Total number of users
 *         totalProducts:
 *           type: number
 *           description: Total number of products
 *         totalCategories:
 *           type: number
 *           description: Total number of categories
 *         totalStores:
 *           type: number
 *           description: Total number of stores
 *       example:
 *         totalUsers: 100
 *         totalProducts: 250
 *         totalCategories: 30
 *         totalStores: 5
 *
 *     SummarySpecificDto:
 *       type: object
 *       properties:
 *         salesTotal:
 *           type: number
 *           description: Total sales amount
 *         purchasesTotal:
 *           type: number
 *           description: Total purchases amount
 *         transactionsCount:
 *           type: number
 *           description: Total number of transactions
 *         recentTransactions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *       example:
 *         salesTotal: 150000
 *         purchasesTotal: 120000
 *         transactionsCount: 25
 *         recentTransactions: []
 */
