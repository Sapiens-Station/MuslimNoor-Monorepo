import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { JamatService } from '../services/jamat.service';

@Controller('jamat')
export class JamatController {
  constructor(private readonly jamatService: JamatService) {}

  @Post('set')
  async setJamatTimes(@Body() body) {
    return this.jamatService.setJamatTimes(body.mosqueId, body.date, body.jamatTimes);
  }

  @Get('today')
  async getJamatTimes(@Query('mosqueId') mosqueId: string, @Query('date') date: string) {
    return this.jamatService.getJamatTimes(mosqueId, date);
  }

  @Post('auto-fill')
  async autoFillJamatTimes(@Body() body) {
    return this.jamatService.autoFillJamatTimes(body.mosqueId, body.lat, body.lon, body.date);
  }
}