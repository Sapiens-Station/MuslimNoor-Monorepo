import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationService } from './services/donation.service';
import { DonationsController } from './controllers/donations.controller';
import { DonationSchema } from './schemas/donation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Donation', schema: DonationSchema }])],
  controllers: [DonationsController],
  providers: [DonationService],
  exports: [DonationService], // ✅ Exporting the service
})
export class DonationsModule {}
