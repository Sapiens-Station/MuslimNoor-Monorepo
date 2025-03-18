import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './services/events.service';
import { EventsController } from './controllers/events.controller';
import { EventSchema } from './schemas/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])], // Add Mongoose feature if applicable
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService], // ✅ Exporting the service so other modules (like AdminModule) can use it
})
export class EventsModule {}
