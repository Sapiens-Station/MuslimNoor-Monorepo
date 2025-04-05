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
import { EventService } from '../services/event.service'
import { CreateEventDto } from '../../dtos/create-event.dto'
import { UpdateEventDto } from '../../dtos/update-event.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { Roles } from '../../auth/decorators/roles.decorator'

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles('admin')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto)
  }

  @Get()
  findAll() {
    return this.eventService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findById(id)
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto)
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.eventService.delete(id)
  }
}
