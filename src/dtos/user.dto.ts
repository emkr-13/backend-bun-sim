import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";


export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  fullname!: string;
}


export class UserProfileDto {
  @IsEmail()
  email!: string;

  @IsString()
  fullname!: string;

  createdAt!: Date;

  updatedAt!: Date;
}


export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}


export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;

  @IsNotEmpty()
  @IsString()
  fullname!: string;
}
