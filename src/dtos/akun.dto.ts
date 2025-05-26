import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export type AkunType = "customer" | "supplier";

export class CreateAkunDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsEnum(["customer", "supplier"], {
    message: 'Type must be either "customer" or "supplier"',
  })
  type!: AkunType;
}

export class UpdateAkunDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(["customer", "supplier"], {
    message: 'Type must be either "customer" or "supplier"',
  })
  type?: AkunType;
}

export class DeleteAkunDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

export class AkunDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id!: number;
}

export class AkunResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @IsEnum(["customer", "supplier"])
  type!: AkunType;

  createdAt!: Date;

  updatedAt!: Date;
}
