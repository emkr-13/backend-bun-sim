import {
  IsEmail,
  IsEnum,
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
 *     AkunType:
 *       type: string
 *       enum: [customer, supplier]
 */
export type AkunType = "customer" | "supplier";

/**
 * @swagger
 * components:
 *   schemas:
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
 */
export class CreateAkunDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsEnum(["customer", "supplier"], {
    message: 'Type must be either "customer" or "supplier"',
  })
  type!: AkunType;
}

/**
 * @swagger
 * components:
 *   schemas:
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
 */
export class UpdateAkunDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(["customer", "supplier"], {
    message: 'Type must be either "customer" or "supplier"',
  })
  type?: AkunType;
}

/**
 * @swagger
 * components:
 *   schemas:
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
 */
export class DeleteAkunDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
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
 */
export class AkunDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
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
export class AkunResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @IsEnum(["customer", "supplier"])
  type!: AkunType;

  createdAt!: Date;

  updatedAt!: Date;
}
