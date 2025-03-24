import { IsString, IsOptional, IsIn } from 'class-validator';

export class TrackSalatDto {
  @IsString()
  @IsIn(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'])
  prayerName: string;

  @IsString()
  @IsIn(['on_time', 'late', 'missed'])
  status: string;

  @IsOptional()
  @IsString() // format: YYYY-MM-DD
  date?: string;
}
