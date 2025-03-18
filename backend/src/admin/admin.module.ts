import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UserModule } from '../user/user.module';
import { EventsModule } from '../events/events.module';
import { DonationsModule } from '../donations/donations.module';
import { PrayersModule } from '../prayers/prayers.module';

@Module({
  imports: [UserModule, EventsModule, DonationsModule, PrayersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}