import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePrayerDto {
  @IsNotEmpty()
  @IsString()
  name: string; // e.g., Fajr, Dhuhr, Asr, Maghrib, Isha

  @IsNotEmpty()
  @IsString()
  time: string; // e.g., "05:30 AM"

  @IsOptional()
  @IsString()
  notes?: string;
}
