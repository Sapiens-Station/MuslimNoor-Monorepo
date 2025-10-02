import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import axios from 'axios';
import { PrayerTimes } from '../interface/prayer-times.interface';

@Injectable()
export class PrayerTimesService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  // 🔹 Fetch and cache a month’s prayer times from Aladhan API
  async fetchAndCacheMonthlyPrayerTimes(
    lat: number,
    lon: number,
    month: number,
    year: number,
  ) {
    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`;
    try {
      // ✅ Check cache first
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=2&month=${month}&year=${year}`;
      const response = await axios.get(url);
      const monthlyData = response.data.data;

      // ✅ Set TTL until month ends (avoid stale months in Redis)
      const now = new Date();
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const secondsRemaining = (lastDayOfMonth - now.getDate() + 1) * 86400;

      await this.redis.set(
        cacheKey,
        JSON.stringify(monthlyData),
        'EX',
        secondsRemaining,
      );

      return monthlyData;
    } catch (error: any) {
      console.error(
        'Prayer API fetch failed:',
        error.response?.statusText ?? error.message,
      );
      throw new Error(
        `Failed to fetch or cache prayer times: ${
          error.response?.statusText ?? error.message
        }`,
      );
    }
  }

  // 🔹 Get daily prayer times; fetch month if cache is missing
  async getDailyPrayerTimes(
    lat: number,
    lon: number,
    date: string,
  ): Promise<PrayerTimes> {
    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`;
    let monthlyData: any;

    // ✅ Try cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      monthlyData = JSON.parse(cached);
    } else {
      // Auto-fetch if not cached
      monthlyData = await this.fetchAndCacheMonthlyPrayerTimes(
        lat,
        lon,
        month,
        year,
      );
    }

    const daily = monthlyData[day - 1];
    if (!daily || !daily.timings) {
      throw new Error(`Prayer times not available for ${date}`);
    }

    // 🔹 Only required prayers
    const requiredPrayers: (keyof PrayerTimes)[] = [
      'Fajr',
      'Dhuhr',
      'Asr',
      'Maghrib',
      'Isha',
    ];

    const cleaned: PrayerTimes = {
      Fajr: '',
      Dhuhr: '',
      Asr: '',
      Maghrib: '',
      Isha: '',
    };

    // ✅ Extract times (strip " (GMT+...)" suffix cleanly)
    for (const p of requiredPrayers) {
      cleaned[p] = daily.timings[p]?.replace(/ \(.*\)/, '') ?? '00:00';
    }

    // ✅ Add Jumuah: Friday uses Dhuhr timing
    if (daily.date.gregorian.weekday.en === 'Friday') {
      cleaned['Jumuah'] = cleaned.Dhuhr;
    }

    return cleaned;
  }
}
