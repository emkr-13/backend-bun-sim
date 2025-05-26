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

export class PurchaseDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

export class UpdatePurchaseStatusDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;

  @IsNotEmpty()
  @IsEnum(purchaseStatus.enumValues)
  status!: (typeof purchaseStatus.enumValues)[number];
}
