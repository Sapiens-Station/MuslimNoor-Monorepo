import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import mongoose from 'mongoose';
import { Cache } from 'cache-manager';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // ✅ Ensure Required Environment Variables
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muslimnoor';
  const redisHost = process.env.REDIS_HOST || '127.0.0.1';
  const redisPort = process.env.REDIS_PORT || '6379';

  if (!mongoUri || !redisHost || !redisPort) {
    Logger.error('❌ Missing required environment variables (MONGO_URI, REDIS_HOST, REDIS_PORT)', '', 'Bootstrap');
    process.exit(1); // Stop application
  }

  // ✅ Connect to MongoDB
  try {
    await mongoose.connect(mongoUri, {
      dbName: 'muslimnoor',  // ✅ Ensure you are using the correct database
    });
    Logger.log('✅ MongoDB Connected Successfully', 'Bootstrap');
  } catch (error) {
    Logger.error('❌ MongoDB Connection Failed', error.message, 'Bootstrap');
    process.exit(1); // Exit if MongoDB fails to connect
  }

  // ✅ Test Redis Connection
  try {
    const cacheManager = app.get<Cache>(CACHE_MANAGER);
    await cacheManager.set('test_key', 'Hello, Redis!', 60); // TTL as separate parameter
    const redisData = await cacheManager.get('test_key');
    Logger.log(`✅ Redis Test Value: ${redisData}`, 'Bootstrap');
  } catch (error) {
    Logger.error('❌ Redis Connection Failed', error.message, 'Bootstrap');
    process.exit(1); // Exit if Redis is not working
  }

  // ✅ Apply Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use('/donations/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());


  // ✅ Start the Server on Port 3000 (Listen on 0.0.0.0 for Docker)
  await app.listen(3000, '0.0.0.0');
  Logger.log(`🚀 Server running on http://localhost:3000`, 'Bootstrap');
}

bootstrap();
