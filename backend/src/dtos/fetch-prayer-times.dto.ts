import { IsNumber } from 'class-validator'

export class FetchPrayerTimesDto {
  @IsNumber() lat: number
  @IsNumber() lon: number
  @IsNumber() month: number
  @IsNumber() year: number
}
