import { Controller, Post, UseGuards } from '@nestjs/common'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { NotificationSchedulerService } from '../services/notification-scheduler.service'

@Controller('jamat/schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class NotificationSchedulerController {
  constructor(
    private readonly schedulerService: NotificationSchedulerService
  ) {}

  @Post()
  async scheduleToday() {
    return this.schedulerService.scheduleTodayJamatNotifications()
  }
}
