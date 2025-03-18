import { Controller, Get } from '@nestjs/common';
import { DonationsService } from '../services/donations.service';

@Controller('donations')
export class DonationsController {
     constructor(private readonly donationsService: DonationsService) {}
    
      @Get()
      getAllDonations() {
        return this.donationsService.findAll();
      }
}
