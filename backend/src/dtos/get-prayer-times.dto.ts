import { IsNumber, IsString } from 'class-validator'

export class GetPrayerTimesDto {
  @IsNumber() lat: number
  @IsNumber() lon: number
  @IsString() date: string // Format: YYYY-MM-DD
}
