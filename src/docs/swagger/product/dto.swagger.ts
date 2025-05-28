/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - name
 *         - categoryId
 *         - price
 *         - satuan
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description (optional)
 *         categoryId:
 *           type: integer
 *           minimum: 1
 *           description: Category ID
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Product price
 *         satuan:
 *           type: string
 *           enum: [pcs, box, kg]
 *           description: Unit of measurement
 *       example:
 *         name: Laptop XYZ
 *         description: High-performance laptop
 *         categoryId: 1
 *         price: 1200
 *         satuan: pcs
 *
 *     UpdateProductDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name (optional)
 *         description:
 *           type: string
 *           description: Product description (optional)
 *         categoryId:
 *           type: integer
 *           minimum: 1
 *           description: Category ID (optional)
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Product price (optional)
 *         satuan:
 *           type: string
 *           enum: [pcs, box, kg]
 *           description: Unit of measurement (optional)
 *       example:
 *         id: 1
 *         name: Laptop XYZ Pro
 *         description: Updated high-performance laptop
 *         categoryId: 1
 *         price: 1500
 *         satuan: pcs
 *
 *     DeleteProductDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           description: Product ID to delete
 *       example:
 *         id: 1
 *
 *     ProductDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           description: Product ID to retrieve details
 *       example:
 *         id: 1
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         sku:
 *           type: string
 *         price_sell:
 *           type: number
 *         price_cost:
 *           type: number
 *         satuan:
 *           type: string
 *           enum: [pcs, box, kg]
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
