import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  SalatTracking,
  SalatTrackingSchema,
} from './schemas/salat-tracking.schema'
import { SalatTrackingController } from './controllers/salat-tracking.controller'
import { SalatTrackingService } from './services/salat-tracking.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalatTracking.name, schema: SalatTrackingSchema },
    ]),
  ],
  controllers: [SalatTrackingController],
  providers: [SalatTrackingService],
  exports: [SalatTrackingService],
})
export class SalatTrackingModule {}
