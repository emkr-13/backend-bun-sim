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
 *           description: Product description
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         price:
 *           type: number
 *           description: Product selling price
 *         satuan:
 *           type: string
 *           description: Unit of measurement
 *       example:
 *         name: Laptop XYZ
 *         description: High-performance laptop
 *         categoryId: 123e4567-e89b-12d3-a456-426614174000
 *         price: 1200
 *         satuan: unit
 *
 *     UpdateProductDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         price:
 *           type: number
 *           description: Product selling price
 *         satuan:
 *           type: string
 *           description: Unit of measurement
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         name: Laptop XYZ Pro
 *         description: Updated high-performance laptop
 *         categoryId: 123e4567-e89b-12d3-a456-426614174000
 *         price: 1500
 *         satuan: unit
 *
 *     DeleteProductDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Product ID to delete
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *
 *     ProductDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Product ID to retrieve details
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *
 *     ProductDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         sku:
 *           type: string
 *           description: Stock Keeping Unit
 *         price_sell:
 *           type: string
 *           description: Selling price
 *         price_cost:
 *           type: string
 *           description: Cost price
 *         satuan:
 *           type: string
 *           description: Unit of measurement
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         sku:
 *           type: string
 *         price_sell:
 *           type: string
 *         price_cost:
 *           type: string
 *         satuan:
 *           type: string
 *         categoryId:
 *           type: string
 *           format: uuid
 *         categoryName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
