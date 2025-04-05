import { Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { TrackSalatDto } from 'src/dtos/track-salat.dto'
import { UserDocument } from 'src/users/schemas/user.schema'
import { SalatTrackingService } from '../services/salat-tracking.service'

@Controller('track-salat')
export class SalatTrackingController {
  constructor(private readonly salatTrackingService: SalatTrackingService) {}

  @Post()
  async track(@CurrentUser() user: UserDocument, @Body() dto: TrackSalatDto) {
    return this.salatTrackingService.track(user._id.toString(), dto)
  }
}
