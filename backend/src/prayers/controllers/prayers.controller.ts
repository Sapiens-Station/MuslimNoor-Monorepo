import { Controller, Get } from '@nestjs/common';
import { PrayersService } from '../services/prayers.service';

@Controller('prayers')
export class PrayersController {
    constructor(private readonly prayersService: PrayersService) {}
    
      @Get()
      getAllEvents() {
        return this.prayersService.findAll();
      }
}
