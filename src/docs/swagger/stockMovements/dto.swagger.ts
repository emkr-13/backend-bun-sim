/**
 * @swagger
 * components:
 *   schemas:
 *     StockMovementDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           description: Stock movement ID to retrieve details
 *       example:
 *         id: 1
 *
 *     ListStockMovementsDto:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           description: Page number for pagination
 *         limit:
 *           type: integer
 *           minimum: 1
 *           description: Number of items per page
 *         search:
 *           type: string
 *           description: Search term for filtering results
 *         movementType:
 *           type: string
 *           enum: [in, out]
 *           description: Filter by movement type
 *         sortBy:
 *           type: string
 *           description: Field to sort by
 *         sortOrder:
 *           type: string
 *           enum: [asc, desc]
 *           description: Sort order direction
 *       example:
 *         page: 1
 *         limit: 10
 *         search: "laptop"
 *         movementType: "in"
 *         sortBy: "createdAt"
 *         sortOrder: "desc"
 *
 *     StockMovementResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Stock movement ID
 *         productId:
 *           type: integer
 *           description: Product ID
 *         productName:
 *           type: string
 *           description: Product name
 *         productSku:
 *           type: string
 *           description: Product SKU
 *         productSatuan:
 *           type: string
 *           description: Product unit of measurement
 *         movementType:
 *           type: string
 *           enum: [in, out]
 *           description: Type of movement
 *         quantity:
 *           type: integer
 *           description: Quantity moved
 *         note:
 *           type: string
 *           description: Additional note
 *         akunId:
 *           type: integer
 *           description: Account ID
 *         akunName:
 *           type: string
 *           description: Account name
 *         storeId:
 *           type: integer
 *           description: Store ID
 *         storeName:
 *           type: string
 *           description: Store name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *       example:
 *         id: 1
 *         productId: 1
 *         productName: "Laptop XYZ"
 *         productSku: "SKU-123"
 *         productSatuan: "pcs"
 *         movementType: "in"
 *         quantity: 10
 *         note: "Received new stock from supplier"
 *         akunId: 2
 *         akunName: "Purchases"
 *         storeId: 1
 *         storeName: "Main Store"
 *         createdAt: "2023-08-15T08:00:00.000Z"
 *         updatedAt: "2023-08-15T08:00:00.000Z"
 *
 *     StockMovementListResponseDto:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StockMovementResponseDto'
 *         total:
 *           type: integer
 *           description: Total number of records
 *         page:
 *           type: integer
 *           description: Current page
 *         limit:
 *           type: integer
 *           description: Number of records per page
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *       example:
 *         data: [
 *           {
 *             id: 1,
 *             productId: 1,
 *             productName: "Laptop XYZ",
 *             productSku: "SKU-123",
 *             productSatuan: "pcs",
 *             movementType: "in",
 *             quantity: 10,
 *             note: "Received new stock from supplier",
 *             akunId: 2,
 *             akunName: "Purchases",
 *             storeId: 1,
 *             storeName: "Main Store",
 *             createdAt: "2023-08-15T08:00:00.000Z",
 *             updatedAt: "2023-08-15T08:00:00.000Z"
 *           }
 *         ],
 *         total: 50,
 *         page: 1,
 *         limit: 10,
 *         totalPages: 5
 */
