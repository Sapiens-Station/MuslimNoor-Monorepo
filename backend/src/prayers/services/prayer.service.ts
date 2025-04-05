import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// import * as moment from 'moment';
import * as moment from 'moment-timezone'
import { Prayer, PrayerDocument } from '../schemas/prayer.schema'
import { CreatePrayerDto } from 'src/dtos/create-prayer.dto'
import { UpdatePrayerDto } from 'src/dtos/update-prayer.dto'

@Injectable()
export class PrayerService {
  constructor(
    @InjectModel(Prayer.name) private prayerModel: Model<PrayerDocument>
  ) {}

  async create(createPrayerDto: CreatePrayerDto): Promise<Prayer> {
    const timestamp = new Date(createPrayerDto.timestamp)

    const prayerData = {
      ...createPrayerDto,
      timestamp, // ✅ Store as Date
    }

    const prayer = new this.prayerModel(prayerData)
    const savedPrayer = await prayer.save()

    return this.transformPrayer(savedPrayer)
  }

  async findAll(): Promise<Prayer[]> {
    const prayers: PrayerDocument[] = await this.prayerModel
      .find()
      .lean()
      .exec() // ✅ Ensures plain objects

    return prayers.map((prayer) => this.transformPrayer(prayer)) // ✅ Apply transformation
  }

  async findById(id: string): Promise<Prayer> {
    const prayer = await this.prayerModel.findById(id).lean().exec()
    if (!prayer) throw new NotFoundException('Prayer not found')

    return this.transformPrayer(prayer)
  }

  async update(id: string, updatePrayerDto: UpdatePrayerDto): Promise<Prayer> {
    if (updatePrayerDto.timestamp) {
      updatePrayerDto.timestamp = new Date(
        updatePrayerDto.timestamp
      ).toISOString() // ✅ Ensure consistent ISO string format
    }

    const updatedPrayer = await this.prayerModel
      .findByIdAndUpdate(id, updatePrayerDto, { new: true, lean: true })
      .exec()

    if (!updatedPrayer)
      throw new NotFoundException(`Prayer with ID ${id} not found`)

    return this.transformPrayer(updatedPrayer)
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.prayerModel.findByIdAndDelete(id)
    return { message: 'Prayer deleted successfully' }
  }

  /** ✅ Helper function to transform `timestamp` before returning */
  // private transformPrayer(prayer: PrayerDocument | any): Prayer {
  //   return {
  //     ...prayer,
  //     timestamp: (prayer.timestamp instanceof Date ? prayer.timestamp : new Date(prayer.timestamp)).toISOString(), // ✅ Ensures consistent ISO string
  //     time: moment(prayer.timestamp).format('hh:mm A'), // ✅ Extracts time in 12-hour format
  //   };
  // }

  private transformPrayer(prayer: PrayerDocument | any): Prayer {
    if (!prayer || !prayer.timestamp) {
      throw new Error('Invalid prayer data: Missing timestamp')
    }

    // ✅ Ensure `timestamp` is always a Date object
    const timestamp =
      prayer.timestamp instanceof Date
        ? prayer.timestamp
        : new Date(prayer.timestamp)

    return {
      ...prayer,
      timestamp: timestamp.toISOString(), // ✅ Store ISO format for consistency
      time: moment(timestamp).tz('America/Chicago').format('hh:mm A'), // ✅ Convert to Central Time
    }
  }
}
