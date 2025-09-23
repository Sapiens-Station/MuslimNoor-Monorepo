// src/auth/dto/auth.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsMongoId,
  IsOptional,
} from 'class-validator'

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // User selects mosque during registration
  @IsOptional()
  @IsMongoId()
  mosqueId: string;
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
