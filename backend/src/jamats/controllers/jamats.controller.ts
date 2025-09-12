// src/jamats/controllers/jamat.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JamatService } from '../services/jamat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/user.schema';
import { PrayerName } from '../schemas/jamat.schema';

@Controller('jamat')
export class JamatController {
  constructor(private readonly jamatService: JamatService) {}

  // ✅ Purpose: Get jamat schedule for a specific date and mosque (public)
  @Get('today')
  getToday(
    @Query('mosqueId') mosqueId: string,
    @Query('date') date: string,
  ) {
    return this.jamatService.getSchedule(mosqueId, date);
  }

  // ✅ Purpose: Get jamat schedules for the next 10 days (public)
  @Get('ten-days')
  getTenDays(
    @Query('mosqueId') mosqueId: string,
    @Query('from') from?: string,
  ) {
    return this.jamatService.getTenDays(mosqueId, from);
  }

  // ✅ Purpose: Create or upsert jamat schedule for a day
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Post()
  create(
    @Body() body: {
      mosqueId: string;
      date: string;
      jamatTimes: { prayerName: PrayerName; iqamaTime: string; azanTime?: string }[];
    },
    @Req() req: any,
  ) {
    return this.jamatService.createSchedule(body, req.user);
  }

  // ✅ Purpose: Update an entire jamat schedule by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: {
      mosqueId: string;
      date: string;
      jamatTimes: { prayerName: PrayerName; iqamaTime: string; azanTime?: string }[];
    },
    @Req() req: any,
  ) {
    return this.jamatService.updateSchedule(id, body, req.user);
  }

  // ✅ Purpose: Update a single prayer’s iqama time within a schedule
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Patch(':id/prayer')
  updatePrayer(
    @Param('id') id: string,
    @Body() body: { prayerName: PrayerName; iqamaTime: string },
    @Req() req: any,
  ) {
    return this.jamatService.updatePrayerTime(
      id,
      body.prayerName,
      body.iqamaTime,
      req.user,
    );
  }

  // ✅ Purpose: Auto-fill jamat times based on location (lat/lon)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Post('auto-fill')
  autoFill(
    @Body() body: {
      mosqueId: string;
      lat: number;
      lon: number;
      date: string;
    },
    @Req() req: any,
  ) {
    return this.jamatService.autoFillSchedule(body, req.user);
  }

  // ✅ Purpose: Delete a jamat schedule entry
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.jamatService.deleteSchedule(id, req.user);
  }
}
