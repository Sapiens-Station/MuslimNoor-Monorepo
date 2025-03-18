import { Injectable } from '@nestjs/common';
import { DonationsService } from 'src/donations/services/donations.service';
import { EventsService } from 'src/events/services/events.service';
import { PrayersService } from 'src/prayers/services/prayers.service';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly eventsService: EventsService,
    private readonly donationsService: DonationsService,
    private readonly prayersService: PrayersService,
  ) {}

  getAllUsers() {
    return this.userService.findAll();
  }

  getAllEvents() {
    return this.eventsService.findAll();
  }

  getAllDonations() {
    return this.donationsService.findAll();
  }

  getAllPrayers() {
    return this.prayersService.findAll();
  }
}
