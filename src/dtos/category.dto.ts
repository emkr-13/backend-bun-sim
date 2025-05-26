import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}


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


export class DeleteCategoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

export class CategoryDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}


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