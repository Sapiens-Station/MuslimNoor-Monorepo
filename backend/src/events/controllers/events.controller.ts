import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common'
import { EventService } from '../services/event.service'
import { CreateEventDto } from '../../dtos/create-event.dto'
import { UpdateEventDto } from '../../dtos/update-event.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'
import { UserRole } from '../../users/schemas/user.schema'

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  // 📌 Create event (mosqueAuthority auto-assigns mosqueId, admin chooses)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventService.create(dto, req.user)
  }

  // 📌 Public: list all events (optionally by mosque)
  @Get()
  findAll(@Query('mosqueId') mosqueId?: string) {
    return this.eventService.findAll(mosqueId)
  }

  // 📌 Public: upcoming events
  @Get('upcoming')
  getUpcoming(
    @Query('limit') limit?: string,
    @Query('mosqueId') mosqueId?: string
  ) {
    return this.eventService.findUpcoming(mosqueId, Number(limit) || 5)
  }

  @Get('today')
  getToday(
    @Query('limit') limit?: string,
    @Query('mosqueId') mosqueId?: string
  ) {
    return this.eventService.findToday(mosqueId, Number(limit) || 5)
  }

  // 📌 Public: get single event
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findById(id)
  }

  // 📌 Update event (admin or mosqueAuthority)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.update(id, dto)
  }

  // 📌 Delete event (admin or mosqueAuthority)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.delete(id)
  }
}
