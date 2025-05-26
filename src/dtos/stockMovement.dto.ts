import "reflect-metadata";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsEnum,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { movementType } from "../models/stockMovements";


export class StockMovementDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

export class ListStockMovementsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(["in", "out"], {
    message: "Movement type must be either 'in' or 'out'",
  })
  movementType?: "in" | "out";

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(["asc", "desc"], {
    message: "Sort order must be either 'asc' or 'desc'",
  })
  sortOrder?: "asc" | "desc";
}
