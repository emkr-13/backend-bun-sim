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
  ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";
import { quotationStatus } from "../models/quotation";

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

export class CreateQuotationDto {
  @IsNotEmpty()
  @IsString()
  quotationDate!: string;

  @ValidateIf((o) => !o.storeId)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  customerId!: number;

  @ValidateIf((o) => !o.supplierId)
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

export class QuotationDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

export class UpdateQuotationStatusDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;

  @IsNotEmpty()
  @IsEnum(quotationStatus.enumValues)
  status!: (typeof quotationStatus.enumValues)[number];
}
