import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { DonationsModule } from '../donations/donations.module';
import { PrayersModule } from '../prayers/prayers.module';

@Module({
  imports: [UsersModule, EventsModule, DonationsModule, PrayersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}