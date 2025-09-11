// src/auth/dto/auth.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator'
import { UserRole } from '../roles.enum'

export class RegisterDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole // server defaults to USER
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
