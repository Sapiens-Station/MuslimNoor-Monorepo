// src/auth/dto/auth.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator'
import { UserRole } from '../auth/roles.enum'

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // User selects mosque during registration
  @IsMongoId()
  mosqueId: string;
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
