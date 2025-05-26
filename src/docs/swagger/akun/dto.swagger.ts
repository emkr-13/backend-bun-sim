/**
 * @swagger
 * components:
 *   schemas:
 *     AkunType:
 *       type: string
 *       enum: [customer, supplier]
 *
 *     CreateAkunDto:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: The account name
 *         phone:
 *           type: string
 *           description: Phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         address:
 *           type: string
 *           description: Physical address
 *         type:
 *           $ref: '#/components/schemas/AkunType'
 *       example:
 *         name: John Doe
 *         phone: '+1234567890'
 *         email: john@example.com
 *         address: '123 Main St, City'
 *         type: customer
 *
 *     UpdateAkunDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The account ID
 *         name:
 *           type: string
 *           description: The account name
 *         phone:
 *           type: string
 *           description: Phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         address:
 *           type: string
 *           description: Physical address
 *         type:
 *           $ref: '#/components/schemas/AkunType'
 *       example:
 *         id: 1
 *         name: Updated John Doe
 *         phone: '+9876543210'
 *         email: updated@example.com
 *         address: '456 New St, City'
 *         type: supplier
 *
 *     DeleteAkunDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The account ID
 *       example:
 *         id: 1
 *
 *     AkunDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The account ID
 *       example:
 *         id: 1
 *
 *     AkunResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The account ID
 *         name:
 *           type: string
 *           description: The account name
 *         phone:
 *           type: string
 *           description: Phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         address:
 *           type: string
 *           description: Physical address
 *         type:
 *           $ref: '#/components/schemas/AkunType'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
