/**
 * @swagger
 * components:
 *   schemas:
 *     SummaryGeneralDto:
 *       type: object
 *       properties:
 *         total_customers:
 *           type: number
 *           description: Total number of customers
 *         total_suppliers:
 *           type: number
 *           description: Total number of suppliers
 *         total_stores:
 *           type: number
 *           description: Total number of stores
 *         total_products:
 *           type: number
 *           description: Total number of products
 *       example:
 *         total_customers: 100
 *         total_suppliers: 50
 *         total_stores: 5
 *         total_products: 250
 *
 *     TimeFilterType:
 *       type: string
 *       enum: [today, last_week, last_two_weeks, this_month]
 *       description: Time filter for summary data
 *
 *     SummarySpecificFilterDto:
 *       type: object
 *       properties:
 *         time_filter:
 *           $ref: '#/components/schemas/TimeFilterType'
 *       example:
 *         time_filter: last_week
 *
 *     SummarySpecificDto:
 *       type: object
 *       properties:
 *         total_quotations:
 *           type: number
 *           description: Total quotations in the time period
 *         total_purchases:
 *           type: number
 *           description: Total purchases in the time period
 *         total_stock_movements_in:
 *           type: number
 *           description: Total stock movements (in) in the time period
 *         total_stock_movements_out:
 *           type: number
 *           description: Total stock movements (out) in the time period
 *         time_filter:
 *           $ref: '#/components/schemas/TimeFilterType'
 *       example:
 *         total_quotations: 25
 *         total_purchases: 18
 *         total_stock_movements_in: 42
 *         total_stock_movements_out: 36
 *         time_filter: last_week
 */
