import { IsNotEmpty, IsString, IsOptional, IsDate, IsISO8601, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString() // ✅ Ensures valid date format (ISO 8601)
  timestamp?: string; // Allow user to send timestamp or use default

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  imageUrl: string; // ✅ Add this field to match schema
}
