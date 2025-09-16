import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMosqueDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  emailId: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
