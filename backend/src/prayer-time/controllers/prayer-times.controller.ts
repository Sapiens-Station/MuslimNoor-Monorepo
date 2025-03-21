import { Controller, Get, Query } from '@nestjs/common';
import { PrayerTimesService } from '../services/prayer-times.service';

@Controller('prayer-times')
export class PrayerTimesController {
  constructor(private readonly prayerTimesService: PrayerTimesService) {}

  @Get('fetch')
  async fetchPrayerTimes(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.prayerTimesService.fetchAndCacheMonthlyPrayerTimes(lat, lon, month, year);
  }

  @Get('today')
  async getTodayPrayerTimes(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('date') date: string,
  ) {
    return this.prayerTimesService.getDailyPrayerTimes(lat, lon, date);
  }
}
