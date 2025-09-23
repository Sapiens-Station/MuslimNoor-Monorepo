import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsMongoId,
} from 'class-validator'
import { Types } from 'mongoose'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsString()
  fcmToken?: string

  @IsOptional()
  @IsMongoId()
  mosqueId?: string

  @IsOptional()
  @IsString()
  role?: string
}
