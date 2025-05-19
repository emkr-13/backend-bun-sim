import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
 *           description: The category name
 *         description:
 *           type: string
 *           description: The category description
 *       example:
 *         name: Electronics
 *         description: Electronic devices and accessories
 */
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCategoryDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The category ID
 *         name:
 *           type: string
 *           description: The category name
 *         description:
 *           type: string
 *           description: The category description
 *       example:
 *         id: 1
 *         name: Updated Electronics
 *         description: Updated electronic devices and accessories
 */
export class UpdateCategoryDto {
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
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteCategoryDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The category ID
 *       example:
 *         id: 1
 */
export class DeleteCategoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The category ID
 *       example:
 *         id: 1
 */
export class CategoryDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The category ID
 *         name:
 *           type: string
 *           description: The category name
 *         description:
 *           type: string
 *           description: The category description
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
export class CategoryResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  createdAt!: Date;
  
  updatedAt!: Date;
} 