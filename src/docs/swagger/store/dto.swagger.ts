/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStoreDto:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         name:
 *           type: string
 *           description: Store name
 *         description:
 *           type: string
 *           description: Store description
 *         location:
 *           type: string
 *           description: Store location
 *         manager:
 *           type: string
 *           description: Store manager name
 *         contactInfo:
 *           type: string
 *           description: Contact information
 *         phone:
 *           type: string
 *           description: Store phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Store email address
 *         address:
 *           type: string
 *           description: Store physical address
 *       example:
 *         name: Main Store
 *         description: Our main retail location
 *         location: Downtown
 *         manager: John Doe
 *         contactInfo: Front desk
 *         phone: +1234567890
 *         email: store@example.com
 *         address: 123 Main St, City
 *
 *     UpdateStoreDto:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Store ID
 *         name:
 *           type: string
 *           description: Store name
 *         description:
 *           type: string
 *           description: Store description
 *         location:
 *           type: string
 *           description: Store location
 *         manager:
 *           type: string
 *           description: Store manager name
 *         contactInfo:
 *           type: string
 *           description: Contact information
 *         phone:
 *           type: string
 *           description: Store phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Store email address
 *         address:
 *           type: string
 *           description: Store physical address
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         name: Updated Store
 *         description: Updated description
 *         location: Uptown
 *         manager: Jane Smith
 *         contactInfo: Customer Service
 *         phone: +0987654321
 *         email: updated@example.com
 *         address: 456 Main St, City
 *
 *     DeleteStoreDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Store ID to delete
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *
 *     StoreDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Store ID to retrieve details
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *
 *     StoreResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Store ID
 *         name:
 *           type: string
 *           description: Store name
 *         description:
 *           type: string
 *           description: Store description
 *         location:
 *           type: string
 *           description: Store location
 *         manager:
 *           type: string
 *           description: Store manager name
 *         contactInfo:
 *           type: string
 *           description: Contact information
 *         phone:
 *           type: string
 *           description: Store phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Store email address
 *         address:
 *           type: string
 *           description: Store physical address
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
 *         name: Main Store
 *         description: Our main retail location
 *         location: Downtown
 *         manager: John Doe
 *         contactInfo: Front desk
 *         phone: +1234567890
 *         email: store@example.com
 *         address: 123 Main St, City
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */
