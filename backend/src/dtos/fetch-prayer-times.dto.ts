// src/prayer-time/dto/fetch-prayer-times.dto.ts
import { IsNumberString, IsNotEmpty } from 'class-validator';

export class FetchPrayerTimesDto {
  @IsNumberString()
  @IsNotEmpty()
  lat: string;

  @IsNumberString()
  @IsNotEmpty()
  lon: string;

  @IsNumberString()
  @IsNotEmpty()
  month: string;

  @IsNumberString()
  @IsNotEmpty()
  year: string;
}
