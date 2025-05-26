/**
 * @swagger
 * components:
 *   schemas:
 *     ReportFilterDto:
 *       type: object
 *       properties:
 *         filterType:
 *           type: string
 *           enum: [today, this_week, this_month, custom]
 *           description: Date filter type
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date for custom date range (required if filterType is custom)
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date for custom date range (required if filterType is custom)
 *         title:
 *           type: string
 *           description: Custom title for the report
 */
