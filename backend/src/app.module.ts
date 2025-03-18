import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // ✅ Corrected Import
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store'; // ✅ Import Redis store
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures .env variables are available globally
    }),

    // ✅ MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        const jwtSecret = configService.get<string>('JWT_SECRET'); // ✅ Get JWT_SECRET

        // ✅ Print JWT_SECRET to confirm it's accessible
        Logger.log(`✅ JWT_SECRET Loaded: ${jwtSecret}`, 'Config');

        return {
          uri: mongoUri,
          dbName: 'muslimnoor',
        };
      },
    }),

    // ✅ Redis Cache Module (Uses @nestjs/cache-manager)
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
    }),

    // ✅ Application Modules
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
