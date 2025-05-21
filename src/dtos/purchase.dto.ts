import "reflect-metadata";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsDate,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { purchaseStatus } from "../models/purchase";

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseDetailItemDto:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - unitPrice
 *       properties:
 *         productId:
 *           type: integer
 *           description: The product ID
 *         quantity:
 *           type: integer
 *           description: The quantity of the product
 *         unitPrice:
 *           type: number
 *           description: The unit price of the product
 *         discount:
 *           type: number
 *           description: The discount percentage for this item
 *         notes:
 *           type: string
 *           description: Notes for this item
 */
export class PurchaseDetailItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  productId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePurchaseDto:
 *       type: object
 *       required:
 *         - purchaseDate
 *         - supplierId
 *         - storeId
 *         - details
 *       properties:
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *           description: The purchase date
 *         supplierId:
 *           type: integer
 *           description: The supplier ID
 *         storeId:
 *           type: integer
 *           description: The store ID
 *         discountAmount:
 *           type: number
 *           description: The discount amount for the entire purchase
 *         notes:
 *           type: string
 *           description: Notes for the purchase
 *         paymentDueDate:
 *           type: string
 *           format: date-time
 *           description: The payment due date
 *         paymentTerm:
 *           type: string
 *           description: The payment term (e.g., "Net 30")
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchaseDetailItemDto'
 *           description: The purchase details
 */
export class CreatePurchaseDto {
  @IsNotEmpty()
  @IsDateString()
  purchaseDate!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  supplierId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  storeId!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  paymentDueDate?: string;

  @IsOptional()
  @IsString()
  paymentTerm?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseDetailItemDto)
  details!: PurchaseDetailItemDto[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The purchase ID
 */
export class PurchaseDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePurchaseStatusDto:
 *       type: object
 *       required:
 *         - id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The purchase ID
 *         status:
 *           type: string
 *           enum: [draft, ordered, received, cancelled, paid]
 *           description: The new status for the purchase
 */
export class UpdatePurchaseStatusDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;

  @IsNotEmpty()
  @IsEnum(purchaseStatus.enumValues)
  status!: (typeof purchaseStatus.enumValues)[number];
}
