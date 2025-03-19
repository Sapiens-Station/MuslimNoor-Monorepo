import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEventDto } from '../../dtos/create-event.dto';
import { CreateDonationDto } from '../../dtos/create-donation.dto';
import { CreatePrayerDto } from '../../dtos/create-prayer.dto';
import { UpdateEventDto } from 'src/dtos/update-event.dto';
import { UpdateDonationDto } from 'src/dtos/update-donation.dto';
import { UpdatePrayerDto } from 'src/dtos/update-prayer.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** 👤 Users */
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  /** 📅 Events */
  @Post('events')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.adminService.createEvent(createEventDto);
  }

  @Get('events')
  getAllEvents() {
    return this.adminService.getAllEvents();
  }

  @Get('events/:id')
  getEventById(@Param('id') id: string) {
    return this.adminService.getEventById(id);
  }

  @Put('events/:id')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.adminService.updateEvent(id, updateEventDto);
  }

  @Delete('events/:id')
  deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  /** 💰 Donations */
  @Post('donations')
  createDonation(@Body() createDonationDto: CreateDonationDto) {
    return this.adminService.createDonation(createDonationDto);
  }

  @Get('donations')
  getAllDonations() {
    return this.adminService.getAllDonations();
  }

  @Get('donations/:id')
  getDonationById(@Param('id') id: string) {
    return this.adminService.getDonationById(id);
  }

  @Put('donations/:id')
  updateDonation(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.adminService.updateDonation(id, updateDonationDto);
  }

  @Delete('donations/:id')
  deleteDonation(@Param('id') id: string) {
    return this.adminService.deleteDonation(id);
  }

  /** 🕌 Prayers */
  @Post('prayers')
  createPrayer(@Body() createPrayerDto: CreatePrayerDto) {
    return this.adminService.createPrayer(createPrayerDto);
  }

  @Get('prayers')
  getAllPrayers() {
    return this.adminService.getAllPrayers();
  }

  @Get('prayers/:id')
  getPrayerById(@Param('id') id: string) {
    return this.adminService.getPrayerById(id);
  }

  @Put('prayers/:id')
  updatePrayer(@Param('id') id: string, @Body() updatePrayerDto: UpdatePrayerDto) {
    return this.adminService.updatePrayer(id, updatePrayerDto);
  }

  @Delete('prayers/:id')
  deletePrayer(@Param('id') id: string) {
    return this.adminService.deletePrayer(id);
  }
}
