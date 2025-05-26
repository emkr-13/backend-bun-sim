/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseDetailItemDto:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - unitPrice
 *       properties:
 *         productId:
 *           type: integer
 *           description: The product ID
 *         quantity:
 *           type: integer
 *           description: The quantity of the product
 *         unitPrice:
 *           type: number
 *           description: The unit price of the product
 *         discount:
 *           type: number
 *           description: The discount percentage for this item
 *         notes:
 *           type: string
 *           description: Notes for this item
 *
 *     CreatePurchaseDto:
 *       type: object
 *       required:
 *         - purchaseDate
 *         - supplierId
 *         - storeId
 *         - details
 *       properties:
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *           description: The purchase date
 *         supplierId:
 *           type: integer
 *           description: The supplier ID
 *         storeId:
 *           type: integer
 *           description: The store ID
 *         discountAmount:
 *           type: number
 *           description: The discount amount for the entire purchase
 *         notes:
 *           type: string
 *           description: Notes for the purchase
 *         paymentDueDate:
 *           type: string
 *           format: date-time
 *           description: The payment due date
 *         paymentTerm:
 *           type: string
 *           description: The payment term (e.g., "Net 30")
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchaseDetailItemDto'
 *           description: The purchase details
 *
 *     PurchaseDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The purchase ID
 *
 *     UpdatePurchaseStatusDto:
 *       type: object
 *       required:
 *         - id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The purchase ID
 *         status:
 *           type: string
 *           enum: [draft, ordered, received, cancelled, paid]
 *           description: The new status for the purchase
 *
 *     PurchaseResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         invoiceNumber:
 *           type: string
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *         supplierId:
 *           type: integer
 *         supplierName:
 *           type: string
 *         storeId:
 *           type: integer
 *         storeName:
 *           type: string
 *         totalAmount:
 *           type: number
 *         discountAmount:
 *           type: number
 *         grandTotal:
 *           type: number
 *         status:
 *           type: string
 *         notes:
 *           type: string
 *         paymentDueDate:
 *           type: string
 *           format: date-time
 *         paymentTerm:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PurchaseDetailResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         invoiceNumber:
 *           type: string
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *         supplierId:
 *           type: integer
 *         supplierName:
 *           type: string
 *         storeId:
 *           type: integer
 *         storeName:
 *           type: string
 *         totalAmount:
 *           type: number
 *         discountAmount:
 *           type: number
 *         grandTotal:
 *           type: number
 *         status:
 *           type: string
 *         notes:
 *           type: string
 *         paymentDueDate:
 *           type: string
 *           format: date-time
 *         paymentTerm:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               productName:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               unitPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               subtotal:
 *                 type: number
 *               notes:
 *                 type: string
 *               satuan:
 *                 type: string
 */
