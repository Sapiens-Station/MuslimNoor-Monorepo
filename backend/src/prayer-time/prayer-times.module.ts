import { Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis from 'ioredis' // Import ioredis directly
import { PrayerTimesService } from './services/prayer-times.service'
import { PrayerTimesController } from './controllers/prayer-times.controller'

const redisProvider: Provider = {
  provide: 'REDIS_CLIENT', // Provide a unique injection token
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST') || '127.0.0.1',
      port: Number(configService.get<string>('REDIS_PORT')) || 6379,
    })
  },
  inject: [ConfigService],
}

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PrayerTimesController],
  providers: [PrayerTimesService, redisProvider], // Add the provider
  exports: [PrayerTimesService, 'REDIS_CLIENT'], // Export the provider
})
export class PrayerTimesModule {}
