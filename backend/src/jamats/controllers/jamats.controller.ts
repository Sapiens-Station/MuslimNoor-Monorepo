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
} from '@nestjs/common'
import { JamatService } from '../services/jamat.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserRole } from 'src/users/schemas/user.schema'
import { PrayerName } from '../schemas/jamat.schema'
import { UpsertJamatDto, UpdatePrayerDto, AutoFillDto } from '~/dtos/jamat.dto'
import { AutoFillJamatDto } from '~/dtos/auto-fill-jamat.dto'

@Controller('jamat')
export class JamatController {
  constructor(private readonly jamatService: JamatService) {}

  @Get('today')
  getToday(@Query('mosqueId') mosqueId: string, @Query('date') date: string) {
    return this.jamatService.getSchedule(mosqueId, date)
  }

  @Get('ten-days')
  getTenDays(
    @Query('mosqueId') mosqueId: string,
    @Query('from') from?: string
  ) {
    return this.jamatService.getTenDays(mosqueId, from)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Post()
  create(@Body() body: UpsertJamatDto, @Req() req: any) {
    return this.jamatService.createSchedule(body, {
      _id: req.user._id,
      role: req.user.role,
      mosqueId: req.user.mosqueId,
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpsertJamatDto,
    @Req() req: any
  ) {
    return this.jamatService.updateSchedule(id, body, {
      _id: req.user._id,
      role: req.user.role,
      mosqueId: req.user.mosqueId,
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Patch(':id/prayer')
  updatePrayer(
    @Param('id') id: string,
    @Body() body: UpdatePrayerDto,
    @Req() req: any
  ) {
    return this.jamatService.updatePrayerTime(
      id,
      body.prayerName as PrayerName,
      body.iqamaTime,
      {
        _id: req.user._id,
        role: req.user.role,
        mosqueId: req.user.mosqueId,
      }
    )
  }

  // ✅ Purpose: Auto-fill jamat times based on location (lat/lon)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Req() req: any) {
    return this.jamatService.approveSchedule(id, {
      role: req.user.role,
      mosqueId: req.user.mosqueId,
      _id: req.user._id,
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Post('auto-fill')
  autoFill(@Body() body: AutoFillJamatDto, @Req() req: any) {
    return this.jamatService.autoFillSchedule(body, {
      role: req.user.role,
      mosqueId: req.user.mosqueId,
      _id: req.user._id,
    })
  }
}
