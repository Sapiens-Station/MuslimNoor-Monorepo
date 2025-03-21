import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jamat } from '../schemas/jamat.schema';
import { PrayerTimesService } from 'src/prayer-time/services/prayer-times.service';

@Injectable()
export class JamatService {
  constructor(
    @InjectModel(Jamat.name) private jamatModel: Model<Jamat>,
    private readonly prayerTimesService: PrayerTimesService,
  ) {}

  async setJamatTimes(mosqueId: string, date: string, jamatTimes: { prayerName: string; time: string }[]) {
    return this.jamatModel.findOneAndUpdate(
      { mosqueId, date },
      { jamatTimes },
      { upsert: true, new: true },
    );
  }

  async getJamatTimes(mosqueId: string, date: string) {
    return this.jamatModel.findOne({ mosqueId, date });
  }
  
  async autoFillJamatTimes(mosqueId: string, lat: number, lon: number, date: string) {
    const prayerTimes = await this.prayerTimesService.getDailyPrayerTimes(lat, lon, date);
    const jamatTimes = Object.entries(prayerTimes).map(([prayerName, time]) => ({
      prayerName,
      time: String(time),  // ✅ Convert to string
    }));
    return this.setJamatTimes(mosqueId, date, jamatTimes);
  }
  
}