import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *       example:
 *         email: user@example.com
 *         password: password123
 */
export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
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
 *           description: User password
 *         fullname:
 *           type: string
 *           description: User's full name
 *       example:
 *         email: user@example.com
 *         password: password123
 *         fullname: John Doe
 */
export class RegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;

  @IsNotEmpty()
  @IsString()
  fullname!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshTokenDto:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Refresh token for generating new access token
 *       example:
 *         refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
