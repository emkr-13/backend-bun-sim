/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStockMovementDto:
 *       type: object
 *       required:
 *         - productId
 *         - movementType
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: The product ID
 *         movementType:
 *           type: string
 *           enum: [in, out]
 *           description: Type of movement (in or out)
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of products to move
 *         note:
 *           type: string
 *           description: Additional note for the movement
 *         akunId:
 *           type: integer
 *           description: Account ID related to this movement (optional)
 *         storeId:
 *           type: integer
 *           description: Store ID related to this movement (optional)
 *       example:
 *         productId: 1
 *         movementType: "in"
 *         quantity: 10
 *         note: "Received new stock from supplier"
 *         akunId: 2
 *         storeId: 1
 *
 *     StockMovementDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: Stock movement ID to retrieve details
 *       example:
 *         id: 1
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
 */
