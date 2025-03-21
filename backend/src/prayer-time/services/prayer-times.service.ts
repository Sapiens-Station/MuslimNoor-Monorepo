import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import axios from 'axios';

@Injectable()
export class PrayerTimesService {
  constructor(private readonly redisService: RedisService) {}

  async fetchAndCacheMonthlyPrayerTimes(lat: number, lon: number, month: number, year: number) {
    const redisClient = this.redisService.getClient();
    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`;

    // Check if data already exists
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fetch prayer times from Aladhan API
    const url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=2&month=${month}&year=${year}`;
    const response = await axios.get(url);
    const prayerTimes = response.data.data;

    // Store in Redis with 30-day expiration
    await redisClient.setex(cacheKey, 2592000, JSON.stringify(prayerTimes));

    return prayerTimes;
  }

  async getDailyPrayerTimes(lat: number, lon: number, date: string) {
    const redisClient = this.redisService.getClient();
    const [year, month, day] = date.split('-');
    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`;
    
    const cachedData = await redisClient.get(cacheKey);
    if (!cachedData) {
      throw new Error('Prayer times not found, please refresh cache.');
    }

    const prayerTimes = JSON.parse(cachedData);
    return prayerTimes[day].timings;
  }
}