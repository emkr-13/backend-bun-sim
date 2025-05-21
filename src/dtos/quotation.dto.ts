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
} from "class-validator";
import { Type } from "class-transformer";
import { quotationStatus } from "../models/quotation";

/**
 * @swagger
 * components:
 *   schemas:
 *     QuotationDetailItemDto:
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
 *         description:
 *           type: string
 *           description: Additional description for this item
 *         notes:
 *           type: string
 *           description: Notes for this item
 */
export class QuotationDetailItemDto {
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
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateQuotationDto:
 *       type: object
 *       required:
 *         - quotationDate
 *         - customerId
 *         - storeId
 *         - details
 *       properties:
 *         quotationDate:
 *           type: string
 *           format: date
 *           description: The quotation date
 *         customerId:
 *           type: integer
 *           description: The customer ID
 *         storeId:
 *           type: integer
 *           description: The store ID
 *         discountAmount:
 *           type: number
 *           description: The discount amount for the entire quotation
 *         notes:
 *           type: string
 *           description: Notes for the quotation
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuotationDetailItemDto'
 *           description: The quotation details
 */
export class CreateQuotationDto {
  @IsNotEmpty()
  @IsString()
  quotationDate!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  customerId!: number;

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

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuotationDetailItemDto)
  details!: QuotationDetailItemDto[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     QuotationDetailDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The quotation ID
 */
export class QuotationDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateQuotationStatusDto:
 *       type: object
 *       required:
 *         - id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The quotation ID
 *         status:
 *           type: string
 *           enum: [draft, sent, accepted, rejected, expired, converted]
 *           description: The new status for the quotation
 */
export class UpdateQuotationStatusDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;

  @IsNotEmpty()
  @IsEnum(quotationStatus.enumValues)
  status!: typeof quotationStatus.enumValues[number];
} 