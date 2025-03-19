import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDonationDto {
  @IsNotEmpty()
  @IsString()
  donorName: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
