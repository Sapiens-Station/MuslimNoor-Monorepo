import { Injectable, Inject } from '@nestjs/common'
import Redis from 'ioredis'
import axios from 'axios'
import { PrayerTimes } from '../interface/prayer-times.interface'

@Injectable()
export class PrayerTimesService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {} // Inject the Redis client

  async fetchAndCacheMonthlyPrayerTimes(
    lat: number,
    lon: number,
    month: number,
    year: number
  ) {
    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`
    console.log('[PrayerTimes] Fetching key:', cacheKey)

    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        console.log('[PrayerTimes] Found cached data.')
        return JSON.parse(cached)
      }

      const url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=2&month=${month}&year=${year}`
      console.log('[PrayerTimes] Fetching from Aladhan API:', url)

      const response = await axios.get(url)
      const monthlyData = response.data.data

      console.log('[PrayerTimes] Caching fetched data to Redis')
      await this.redis.set(cacheKey, JSON.stringify(monthlyData), 'EX', 2592000) // 30 days TTL

      console.log('[PrayerTimes] Monthly prayer times:', monthlyData)

      return monthlyData
    } catch (error) {
      console.error(
        '[PrayerTimes] Error while fetching and caching:',
        error.message
      )
      throw new Error('Failed to fetch or cache prayer times.')
    }
  }

  async getDailyPrayerTimes(
    lat: number,
    lon: number,
    date: string
  ): Promise<PrayerTimes> {
    const [yearStr, rawMonth, rawDay] = date.split('-')
    const year = Number(yearStr)
    const month = Number(rawMonth) // Remove "0" prefix
    const day = Number(rawDay)

    const cacheKey = `prayer-times:${lat}:${lon}:${year}-${month}`
    console.log('[PrayerTimes] Fetching daily times from key:', cacheKey)

    try {
      const cached = await this.redis.get(cacheKey)
      if (!cached) {
        console.warn(`[PrayerTimes] Cache miss for key: ${cacheKey}`)
        throw new Error('Prayer times not cached. Please fetch first.')
      }

      const monthlyData = JSON.parse(cached)
      const daily = monthlyData[day - 1]

      if (!daily || !daily.timings) {
        console.error('[PrayerTimes] Timings not found for day:', day)
        throw new Error(`Prayer times not available for ${date}`)
      }

      const timings = daily.timings as Record<string, string>
      const requiredPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

      const cleanedTimings: PrayerTimes = {
        Fajr: '',
        Dhuhr: '',
        Asr: '',
        Maghrib: '',
        Isha: '',
      }

      for (const prayer of requiredPrayers) {
        cleanedTimings[prayer] = timings[prayer]?.split(' ')[0] ?? '00:00'
      }

      return cleanedTimings
    } catch (error) {
      console.error(
        '[PrayerTimes] Error fetching daily prayer times:',
        error.message
      )
      throw error
    }
  }
}
