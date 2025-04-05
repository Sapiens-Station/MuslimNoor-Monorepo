import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  SalatTracking,
  SalatTrackingDocument,
} from '../schemas/salat-tracking.schema'
import { Model } from 'mongoose'
import { TrackSalatDto } from 'src/dtos/track-salat.dto'

@Injectable()
export class SalatTrackingService {
  constructor(
    @InjectModel(SalatTracking.name)
    private readonly salatModel: Model<SalatTrackingDocument>
  ) {}

  async track(userId: string, dto: TrackSalatDto) {
    const { prayerName, status, date } = dto

    const entry = await this.salatModel.findOneAndUpdate(
      {
        userId,
        prayerName,
        date: date || new Date().toISOString().slice(0, 10),
      },
      { status },
      { upsert: true, new: true }
    )

    return { message: 'Tracked successfully', data: entry }
  }
}
