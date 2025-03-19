import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrayersController } from './controllers/prayers.controller';
import { PrayerService } from './services/prayer.service';
import { PrayerSchema } from './schemas/prayer.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Prayer', schema: PrayerSchema }])],
  controllers: [PrayersController],
  providers: [PrayerService],
  exports: [PrayerService], // ✅ Exporting the service
})
export class PrayersModule {}
