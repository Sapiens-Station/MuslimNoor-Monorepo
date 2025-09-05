import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @MinLength(6)
  password: string

  @IsString()
  @IsOptional()
  role?: string; // Optional: user can register as "admin"
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
