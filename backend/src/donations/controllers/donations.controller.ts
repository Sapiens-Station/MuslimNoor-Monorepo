import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CreateDonationDto } from '../../dtos/create-donation.dto';
import { UpdateDonationDto } from '../../dtos/update-donation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { DonationService } from '../services/donation.service';

@Controller('donations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonationsController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  @Roles('admin')
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationService.create(createDonationDto);
  }

  @Get()
  findAll() {
    return this.donationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationService.findById(id);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationService.update(id, updateDonationDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.donationService.delete(id);
  }
}
