import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { PrayerTimesController } from './controllers/prayer-times.controller';
import { PrayerTimesService } from './services/prayer-times.service';

@Module({
  imports: [RedisModule],
  controllers: [PrayerTimesController],
  providers: [PrayerTimesService],
  exports: [PrayerTimesService],
})
export class PrayerTimesModule {}