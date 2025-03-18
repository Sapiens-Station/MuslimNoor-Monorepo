import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrayersController } from './controllers/prayers.controller';
import { PrayersService } from './services/prayers.service';
import { PrayerSchema } from './schemas/prayer.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Prayer', schema: PrayerSchema }])],
  controllers: [PrayersController],
  providers: [PrayersService],
  exports: [PrayersService], // ✅ Exporting the service
})
export class PrayersModule {}
