import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { EventService } from '../../events/services/event.service';
import { DonationService } from '../../donations/services/donation.service';
import { PrayerService } from '../../prayers/services/prayer.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly donationService: DonationService,
    private readonly prayerService: PrayerService,
  ) {}

  /** 👤 User Management */
  getAllUsers() {
    return this.userService.findAll();
  }

  getUserById(id: string) {
    return this.userService.findById(id);
  }

  updateUser(id: string, updateUserDto: any) {
    return this.userService.update(id, updateUserDto);
  }

  deleteUser(id: string) {
    return this.userService.delete(id);
  }

  /** 📅 Event Management */
  createEvent(eventDto) {
    return this.eventService.create(eventDto);
  }

  getAllEvents() {
    return this.eventService.findAll();
  }

  getEventById(id: string) {
    return this.eventService.findById(id);
  }

  updateEvent(id: string, eventDto) {
    return this.eventService.update(id, eventDto);
  }

  deleteEvent(id: string) {
    return this.eventService.delete(id);
  }

  /** 💰 Donation Management */
  createDonation(donationDto) {
    return this.donationService.create(donationDto);
  }

  getAllDonations() {
    return this.donationService.findAll();
  }

  getDonationById(id: string) {
    return this.donationService.findById(id);
  }

  updateDonation(id: string, donationDto) {
    return this.donationService.update(id, donationDto);
  }

  deleteDonation(id: string) {
    return this.donationService.delete(id);
  }

  /** 🕌 Prayer Management */
  createPrayer(prayerDto) {
    return this.prayerService.create(prayerDto);
  }

  getAllPrayers() {
    return this.prayerService.findAll();
  }

  getPrayerById(id: string) {
    return this.prayerService.findById(id);
  }

  updatePrayer(id: string, prayerDto) {
    return this.prayerService.update(id, prayerDto);
  }

  deletePrayer(id: string) {
    return this.prayerService.delete(id);
  }
}
