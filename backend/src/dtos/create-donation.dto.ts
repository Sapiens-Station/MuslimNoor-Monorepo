import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsISO8601, IsDateString } from 'class-validator';

export class CreateDonationDto {
  @IsNotEmpty()
  @IsString()
  donorName: string;

  @IsOptional()
  @IsString()
  donorEmail?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string; // e.g., PayPal, Bank Transfer

  @IsOptional()
  @IsString()
  receiptUrl?: string; // URL to a digital receipt

  @IsOptional()
  @IsString()
  message?: string;
  
  @IsOptional()
  @IsDateString() // ✅ Ensures valid date format (ISO 8601)
  timestamp?: string; // Allow user to send timestamp or use default

  @IsOptional()
  @IsString()
  category?: string; // Default will be 'general'

  @IsOptional()
  @IsString()
  status?: string; // Default will be 'pending'

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsBoolean()
  verifiedByAdmin?: boolean;
}
