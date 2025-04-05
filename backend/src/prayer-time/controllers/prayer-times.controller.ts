import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { PrayerTimesService } from '../services/prayer-times.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'

@Controller('prayer-times')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrayerTimesController {
  constructor(private readonly prayerTimesService: PrayerTimesService) {}

  @Roles('admin')
  @Get('fetch')
  async fetch(@Query() query: any) {
    const { lat, lon, month, year } = query
    return this.prayerTimesService.fetchAndCacheMonthlyPrayerTimes(
      +lat,
      +lon,
      +month,
      +year
    )
  }

  @Get('today')
  async getToday(@Query() query: any) {
    const { lat, lon, date } = query
    return this.prayerTimesService.getDailyPrayerTimes(+lat, +lon, date)
  }
}
