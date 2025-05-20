import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           description: The product name
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: number
 *           description: The product price
 *         categoryId:
 *           type: integer
 *           description: The category ID
 */
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  categoryId!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID
 *         name:
 *           type: string
 *           description: The product name
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: number
 *           description: The product price
 *         categoryId:
 *           type: integer
 *           description: The category ID
 */
export class UpdateProductDto {
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
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  categoryId?: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteProductDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID
 *       example:
 *         id: 1
 */
export class DeleteProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID
 *       example:
 *         id: 1
 */
export class ProductDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}
