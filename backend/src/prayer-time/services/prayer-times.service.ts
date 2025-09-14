// src/prayer-time/services/prayer-times.service.ts
import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import axios from 'axios';
import { PrayerTimes } from '../interface/prayer-times.interface';

@Injectable()
export class PrayerTimesService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  // Fetch and cache a month’s prayer times from Aladhan API
  async fetchAndCacheMonthlyPrayerTimes(
    lat: number,
    lon: number,
    month: number,
    year: number,
  ) {
    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`;
    try {
      // Check existing cache first
      const cached = await this.redis.get(cacheKey);
      console.log('Checking cache for key:', cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=2&month=${month}&year=${year}`;
      const response = await axios.get(url);
      console.log('Fetched prayer times from API:', url);
      const monthlyData = response.data.data;

      // TTL: 30 days
      await this.redis.set(cacheKey, JSON.stringify(monthlyData), 'EX', 60 * 60 * 24 * 30);
      return monthlyData;
    } catch (error) {
      throw new Error('Failed to fetch or cache prayer times.');
    }
  }

  // Get daily prayer times; fetch month if cache is missing
  async getDailyPrayerTimes(
    lat: number,
    lon: number,
    date: string,
  ): Promise<PrayerTimes> {
    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr); // "09" -> 9
    const day = Number(dayStr);

    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`;
    let monthlyData: any;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      monthlyData = JSON.parse(cached);
    } else {
      // Auto-fetch if not cached
      monthlyData = await this.fetchAndCacheMonthlyPrayerTimes(lat, lon, month, year);
    }

    const daily = monthlyData[day - 1];
    if (!daily || !daily.timings) {
      throw new Error(`Prayer times not available for ${date}`);
    }

    const requiredPrayers: (keyof PrayerTimes)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const cleaned: PrayerTimes = {
      Fajr: '',
      Dhuhr: '',
      Asr: '',
      Maghrib: '',
      Isha: '',
    };

    // Extract only the times (strip " +06:00" suffix from API)
    for (const p of requiredPrayers) {
      cleaned[p] = daily.timings[p]?.split(' ')[0] ?? '00:00';
    }
    return cleaned;
  }
}
