import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsEnum,
} from "class-validator";


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


export class DeleteProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}


export class ProductDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}
