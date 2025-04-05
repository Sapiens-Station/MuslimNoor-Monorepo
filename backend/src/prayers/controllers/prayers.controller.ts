import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'
import { PrayerService } from '../services/prayer.service'
import { CreatePrayerDto } from '../../dtos/create-prayer.dto'
import { UpdatePrayerDto } from '../../dtos/update-prayer.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'

@Controller('prayers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrayersController {
  constructor(private readonly prayerService: PrayerService) {}

  @Post()
  @Roles('admin')
  create(@Body() createPrayerDto: CreatePrayerDto) {
    return this.prayerService.create(createPrayerDto)
  }

  @Get()
  findAll() {
    return this.prayerService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prayerService.findById(id)
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updatePrayerDto: UpdatePrayerDto) {
    return this.prayerService.update(id, updatePrayerDto)
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.prayerService.delete(id)
  }
}
