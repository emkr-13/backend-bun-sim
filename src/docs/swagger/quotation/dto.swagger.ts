/**
 * @swagger
 * components:
 *   schemas:
 *     QuotationDetailItemDto:
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
 *         description:
 *           type: string
 *           description: Additional description for this item
 *         notes:
 *           type: string
 *           description: Notes for this item
 *
 *     CreateQuotationDto:
 *       type: object
 *       required:
 *         - quotationDate
 *         - customerId
 *         - storeId
 *         - details
 *       properties:
 *         quotationDate:
 *           type: string
 *           format: date
 *           description: The quotation date
 *         customerId:
 *           type: integer
 *           description: The customer ID
 *         storeId:
 *           type: integer
 *           description: The store ID
 *         discountAmount:
 *           type: number
 *           description: The discount amount for the entire quotation
 *         notes:
 *           type: string
 *           description: Notes for the quotation
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuotationDetailItemDto'
 *           description: The quotation details
 *
 *     QuotationDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The quotation ID
 *
 *     UpdateQuotationStatusDto:
 *       type: object
 *       required:
 *         - id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The quotation ID
 *         status:
 *           type: string
 *           enum: [draft, sent, accepted, rejected, expired, converted]
 *           description: The new status for the quotation
 *
 *     QuotationResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         quotationNumber:
 *           type: string
 *         quotationDate:
 *           type: string
 *           format: date
 *         customerId:
 *           type: integer
 *         customerName:
 *           type: string
 *         storeId:
 *           type: integer
 *         storeName:
 *           type: string
 *         subtotal:
 *           type: number
 *         discountAmount:
 *           type: number
 *         grandTotal:
 *           type: number
 *         status:
 *           type: string
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     QuotationDetailResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         quotationNumber:
 *           type: string
 *         quotationDate:
 *           type: string
 *           format: date
 *         customerId:
 *           type: integer
 *         customerName:
 *           type: string
 *         storeId:
 *           type: integer
 *         storeName:
 *           type: string
 *         subtotal:
 *           type: number
 *         discountAmount:
 *           type: number
 *         grandTotal:
 *           type: number
 *         status:
 *           type: string
 *         notes:
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
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *               satuan:
 *                 type: string
 * 
 * 
 * 
 */

