import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       required:
 *         - fullname
 *       properties:
 *         fullname:
 *           type: string
 *           description: User's full name
 *       example:
 *         fullname: John Doe
 */
export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  fullname!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfileDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         fullname:
 *           type: string
 *           description: User's full name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update date
 */
export class UserProfileDto {

  @IsEmail()
  email!: string;

  @IsString()
  fullname!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChangePasswordDto:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           description: Current user password
 *         newPassword:
 *           type: string
 *           format: password
 *           description: New password to set
 *       example:
 *         currentPassword: oldPassword123
 *         newPassword: newPassword456
 */
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
