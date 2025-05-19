import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStoreDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The store name
 *         description:
 *           type: string
 *           description: The store description
 *         location:
 *           type: string
 *           description: The store location
 *         manager:
 *           type: string
 *           description: The store manager
 *         contactInfo:
 *           type: string
 *           description: Contact information
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
 *       example:
 *         name: Main Store
 *         description: Our flagship store
 *         location: Downtown
 *         manager: John Doe
 *         contactInfo: Main contact
 *         phone: +1234567890
 *         email: store@example.com
 *         address: 123 Main St, City
 */
export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  manager?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateStoreDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The store ID
 *         name:
 *           type: string
 *           description: The store name
 *         description:
 *           type: string
 *           description: The store description
 *         location:
 *           type: string
 *           description: The store location
 *         manager:
 *           type: string
 *           description: The store manager
 *         contactInfo:
 *           type: string
 *           description: Contact information
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
 *       example:
 *         id: 1
 *         name: Updated Store
 *         description: Updated description
 *         location: New Location
 *         manager: Jane Doe
 *         contactInfo: Updated contact
 *         phone: +9876543210
 *         email: updated@example.com
 *         address: 456 New St, City
 */
export class UpdateStoreDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  manager?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteStoreDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The store ID
 *       example:
 *         id: 1
 */
export class DeleteStoreDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The store ID
 *       example:
 *         id: 1
 */
export class StoreDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The store ID
 *         name:
 *           type: string
 *           description: The store name
 *         description:
 *           type: string
 *           description: The store description
 *         location:
 *           type: string
 *           description: The store location
 *         manager:
 *           type: string
 *           description: The store manager
 *         contactInfo:
 *           type: string
 *           description: Contact information
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
export class StoreResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  manager?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  createdAt!: Date;

  updatedAt!: Date;
}
