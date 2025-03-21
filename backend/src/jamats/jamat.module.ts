import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jamat, JamatSchema } from './schemas/jamat.schema';

import { JamatController } from './controllers/jamats.controller';
import { JamatService } from './services/jamat.service';
import { PrayerTimesModule } from 'src/prayer-time/prayer-times.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jamat.name, schema: JamatSchema }]),
    PrayerTimesModule,
  ],
  controllers: [JamatController],
  providers: [JamatService],
})
export class JamatModule {}