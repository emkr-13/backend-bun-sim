import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsUUID,
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
 *           type: string
 *           format: uuid
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
  @IsUUID()
  categoryId!: string;
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
 *           type: string
 *           format: uuid
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
 *           type: string
 *           format: uuid
 *           description: The category ID
 */
export class UpdateProductDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

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
  @IsUUID()
  categoryId?: string;
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
 *           type: string
 *           format: uuid
 *           description: The product ID
 */
export class DeleteProductDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;
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
 *           type: string
 *           format: uuid
 *           description: The product ID
 */
export class ProductDetailDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;
}
