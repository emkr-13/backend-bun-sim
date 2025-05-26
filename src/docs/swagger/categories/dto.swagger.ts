/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategoryDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *       example:
 *         name: Electronics
 *         description: Electronic devices and accessories
 *
 *     UpdateCategoryDto:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         name: Electronics
 *         description: Updated description for electronic devices
 *
 *     DeleteCategoryDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Category ID to delete
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *
 *     CategoryDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Category ID to retrieve details
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *
 *     CategoryResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         name: Electronics
 *         description: Electronic devices and accessories
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */
