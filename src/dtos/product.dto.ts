import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsEnum,
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
 *         - satuan
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
 *         satuan:
 *           type: string
 *           enum: [pcs, box, kg]
 *           description: The product unit of measurement
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

  @IsNotEmpty()
  @IsEnum(["pcs", "box", "kg"], {
    message: "satuan must be one of: pcs, box, kg",
  })
  satuan!: "pcs" | "box" | "kg";
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
 *         satuan:
 *           type: string
 *           enum: [pcs, box, kg]
 *           description: The product unit of measurement
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

  @IsOptional()
  @IsEnum(["pcs", "box", "kg"], {
    message: "satuan must be one of: pcs, box, kg",
  })
  satuan?: "pcs" | "box" | "kg";
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
