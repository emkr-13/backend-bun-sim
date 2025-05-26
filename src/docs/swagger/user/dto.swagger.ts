/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfileDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         fullname:
 *           type: string
 *           description: User full name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Account last update date
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         email: user@example.com
 *         fullname: John Doe
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *
 *     UpdateUserDto:
 *       type: object
 *       required:
 *         - fullname
 *       properties:
 *         fullname:
 *           type: string
 *           description: User full name
 *       example:
 *         fullname: John Doe
 *
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullname
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         password:
 *           type: string
 *           format: password
 *           description: User password (min 6 characters)
 *         fullname:
 *           type: string
 *           description: User full name
 *       example:
 *         email: newuser@example.com
 *         password: password123
 *         fullname: New User
 *
 *     ChangePasswordDto:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           format: password
 *           description: Current user password
 *         newPassword:
 *           type: string
 *           format: password
 *           description: New password (min 6 characters)
 *       example:
 *         oldPassword: currentPassword123
 *         newPassword: newPassword456
 */
