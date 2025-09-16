// src/prayer-time/controllers/prayer-times.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrayerTimesService } from '../services/prayer-times.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/user.schema';
import { FetchPrayerTimesDto } from '../../dtos/fetch-prayer-times.dto';

@Controller('prayer-times')
export class PrayerTimesController {
  constructor(private readonly prayerTimesService: PrayerTimesService) {}

  // ✅ Purpose: Fetch and cache a whole month's prayer times (admin-only or mosqueAuthority if allowed)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN) // 👈 safer default
  @Get('fetch')
  async fetch(@Query() query: FetchPrayerTimesDto) {
    const lat = Number(query.lat);
    const lon = Number(query.lon);
    const month = Number(query.month);
    const year = Number(query.year);

    return this.prayerTimesService.fetchAndCacheMonthlyPrayerTimes(
      lat,
      lon,
      month,
      year,
    );
  }

  // ✅ Purpose: Get prayer times for a specific date (public access)
  @Get('today')
  async getToday(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('date') date: string,
  ) {
    return this.prayerTimesService.getDailyPrayerTimes(
      Number(lat),
      Number(lon),
      date,
    );
  }
}
