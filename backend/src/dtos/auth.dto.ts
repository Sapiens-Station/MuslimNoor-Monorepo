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

  // Always defaults to USER, don’t allow user to set this
  role: UserRole = UserRole.USER;
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
