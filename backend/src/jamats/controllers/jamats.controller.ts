import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { JamatService } from '../services/jamat.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserRole } from 'src/users/schemas/user.schema'
import { BlockJamatDto } from '~/dtos/block-jamat.dto'

@Controller('jamat')
export class JamatController {
  constructor(private readonly jamatService: JamatService) {}

  @Get('today')
  getToday(
    @Query('userMosqueId') mosqueId: string,
    @Query('date') date: string
  ) {
    return this.jamatService.getSchedule(mosqueId, date)
  }

  @Get('ten-days')
  getTenDays(
    @Query('userMosqueId') mosqueId: string,
    @Query('from') from?: string
  ) {
    return this.jamatService.getTenDays(mosqueId, from)
  }

  // ✅ Create 10-day block
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Post()
  create(@Body() body: BlockJamatDto, @Req() req: any) {
    return this.jamatService.createTenDaysSchedule(body, {
      _id: req.user._id,
      role: req.user.role,
      mosqueId: req.user.mosqueId,
    })
  }

  // ✅ Replace 10-day block
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Put()
  update(@Body() body: BlockJamatDto, @Req() req: any) {
    return this.jamatService.updateTenDaysSchedule(body, {
      _id: req.user._id,
      role: req.user.role,
      mosqueId: req.user.mosqueId,
    })
  }

  // ✅ Approve a schedule
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Put(':id/approve')
  approve(@Param('id') id: string, @Req() req: any) {
    return this.jamatService.approveSchedule(id, {
      role: req.user.role,
      mosqueId: req.user.mosqueId,
      _id: req.user._id,
    })
  }
}
