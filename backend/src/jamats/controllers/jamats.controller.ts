import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JamatService } from '../services/jamat.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('jamat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JamatController {
  constructor(private readonly jamatService: JamatService) {}

  @Roles('admin')
  @Post('set')
  async setJamatTimes(@Body() body) {
    return this.jamatService.setJamatTimes(body.mosqueId, body.date, body.jamatTimes);
  }

  @Get('today')
  async getJamatTimes(@Query('mosqueId') mosqueId: string, @Query('date') date: string) {
    return this.jamatService.getJamatTimes(mosqueId, date);
  }

  @Roles('admin')
  @Post('auto-fill')
  async autoFillJamatTimes(@Body() body) {
    return this.jamatService.autoFillJamatTimes(body.mosqueId, body.lat, body.lon, body.date);
  }
}