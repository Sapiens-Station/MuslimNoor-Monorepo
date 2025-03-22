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
        try {
            const prayerTimes = await this.prayerTimesService.getDailyPrayerTimes(lat, lon, date);
            const jamatTimes = Object.entries(prayerTimes).map(([prayerName, time]) => ({
                prayerName,
                time: String(time),
            }));
            return this.setJamatTimes(mosqueId, date, jamatTimes);
        } catch (error) {
            // Handle API errors or other potential issues
            console.error('Error auto-filling jamat times:', error);
            // You might want to throw an error or return a default value here.
            throw new Error('Failed to auto-fill jamat times: ' + error.message);
        }
    }

    async updateJamatTime(mosqueId: string, date: string, prayerName: string, time: string) {
        const jamat = await this.jamatModel.findOne({ mosqueId, date });

        if (!jamat) {
            throw new Error('Jamat times not found.');
        }

        const updatedJamatTimes = jamat.jamatTimes.map((item) => {
            if (item.prayerName === prayerName) {
                return { ...item, time };
            }
            return item;
        });

        return this.jamatModel.findOneAndUpdate(
            { mosqueId, date },
            { jamatTimes: updatedJamatTimes },
            { new: true },
        );
    }
}