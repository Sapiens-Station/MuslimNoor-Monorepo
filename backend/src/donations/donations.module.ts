import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationsService } from './services/donations.service';
import { DonationsController } from './controllers/donations.controller';
import { DonationSchema } from './schemas/donation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Donation', schema: DonationSchema }])],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService], // ✅ Exporting the service
})
export class DonationsModule {}
