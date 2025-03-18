import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { Roles } from '../decorators/admin-role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Get('users')
  @Roles('admin')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('events')
  @Roles('admin')
  getAllEvents() {
    return this.adminService.getAllEvents();
  }

  @Get('donations')
  @Roles('admin')
  getAllDonations() {
    return this.adminService.getAllDonations();
  }

  @Get('prayers')
  @Roles('admin')
  getAllPrayers() {
    return this.adminService.getAllPrayers();
  }
}