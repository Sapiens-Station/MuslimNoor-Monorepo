// src/jamats/services/jamat.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Jamat, JamatDocument, JamatStatus } from '../schemas/jamat.schema'
import { PrayerTimesService } from 'src/prayer-time/services/prayer-times.service'
import { UserRole } from 'src/users/schemas/user.schema'
import { PrayerName } from '../schemas/jamat.schema'
import { startOfDay, addDays } from 'date-fns'

// Utility: normalize a date into [start, end, dayKey]
function dayRangeUtc(date: string | Date) {
  const start = startOfDay(new Date(date))
  const end = addDays(start, 1)
  const dayKey = start.toISOString().split('T')[0]
  return { start, end, dayKey }
}

type CurrentUser = {
  _id: string | Types.ObjectId
  role: UserRole
  mosqueId?: string | Types.ObjectId
}

@Injectable()
export class JamatService {
  constructor(
    @InjectModel(Jamat.name) private jamatModel: Model<JamatDocument>,
    private readonly prayerTimesService: PrayerTimesService
  ) {}

  // ✅ Get a single jamat schedule for a mosque on a specific date
  async getSchedule(mosqueId: string, date: string) {
    const { start, end, dayKey } = dayRangeUtc(date)
    return (
      (await this.jamatModel.findOne({ mosqueId, dayKey }).lean()) ??
      (await this.jamatModel
        .findOne({ mosqueId, date: { $gte: start, $lt: end } })
        .lean())
    )
  }

  // ✅ Get jamat schedules for 10 consecutive days
  // ✅ Get jamat schedules for 10 consecutive days
  async getTenDays(mosqueId: string, from = new Date().toISOString()) {
    console.log(
      'Fetching 10-day jamat schedule from:',
      from,
      'for mosque:',
      mosqueId
    )

    const start = startOfDay(new Date(from)) // normalize start
    const end = addDays(start, 10) // 10 days ahead

    // 🔑 Use $gte/$lt to fetch inclusive start, exclusive end
    const schedules = await this.jamatModel
      .find({
        mosqueId: new Types.ObjectId(mosqueId), // ✅ ensure ObjectId
        date: { $gte: start, $lt: end },
      })
      .sort({ date: 1 })
      .lean()
      .exec()

    return schedules
  }

  // Protect: MosqueAuthority can only update their own mosque
  private assertSameMosqueOrAdmin(
    user: CurrentUser,
    targetMosqueId: Types.ObjectId | string
  ) {
    if (user.role === UserRole.MOSQUE_AUTHORITY) {
      if (String(user.mosqueId ?? '') !== String(targetMosqueId ?? '')) {
        throw new ForbiddenException('Cannot act on another mosque')
      }
    }
  }

  // ✅ Create or update (upsert) a jamat schedule for a mosque on a given date
  async createSchedule(
    body: {
      mosqueId: string
      date: string
      jamatTimes: {
        prayerName: PrayerName
        iqamaTime: string
        azanTime?: string
      }[]
    },
    user: CurrentUser
  ) {
    this.assertSameMosqueOrAdmin(user, body.mosqueId)
    const { start, dayKey } = dayRangeUtc(body.date)

    return this.jamatModel.findOneAndUpdate(
      { mosqueId: body.mosqueId, dayKey },
      {
        mosqueId: new Types.ObjectId(body.mosqueId),
        date: start,
        dayKey,
        jamatTimes: body.jamatTimes,
        status: JamatStatus.PENDING,
        createdBy: new Types.ObjectId(user._id),
      },
      { upsert: true, new: true }
    )
  }

  // ✅ Update an entire jamat schedule
  async updateSchedule(
    id: string,
    body: {
      mosqueId: string
      date: string
      jamatTimes: {
        prayerName: PrayerName
        iqamaTime: string
        azanTime?: string
      }[]
    },
    user: CurrentUser
  ) {
    const jamat = await this.jamatModel.findById(id)
    if (!jamat) throw new NotFoundException('Jamat schedule not found')

    this.assertSameMosqueOrAdmin(user, jamat.mosqueId)
    const { start, dayKey } = dayRangeUtc(body.date)

    return this.jamatModel
      .findByIdAndUpdate(
        id,
        {
          mosqueId: new Types.ObjectId(body.mosqueId),
          date: start,
          dayKey,
          jamatTimes: body.jamatTimes,
        },
        { new: true }
      )
      .lean()
  }

  // ✅ Update a single prayer’s iqama time
  async updatePrayerTime(
    id: string,
    prayerName: PrayerName,
    iqamaTime: string,
    user: CurrentUser
  ) {
    const jamat = await this.jamatModel.findById(id)
    if (!jamat) throw new NotFoundException('Jamat schedule not found')

    this.assertSameMosqueOrAdmin(user, jamat.mosqueId)

    const index = jamat.jamatTimes.findIndex((t) => t.prayerName === prayerName)
    if (index === -1) {
      jamat.jamatTimes.push({ prayerName, iqamaTime })
    } else {
      jamat.jamatTimes[index].iqamaTime = iqamaTime
    }
    await jamat.save()
    return this.jamatModel.findById(id).lean()
  }

  // ✅ Auto-fill jamat schedule using external PrayerTimesService
  async autoFillSchedule(
    body: { mosqueId: string; lat: number; lon: number; date: string },
    user: CurrentUser
  ) {
    this.assertSameMosqueOrAdmin(user, body.mosqueId)

    try {
      // Fetch daily prayer times
      const prayerTimes = await this.prayerTimesService.getDailyPrayerTimes(
        body.lat,
        body.lon,
        body.date
      )

      // Map to jamatTimes format
      const jamatTimes = Object.entries(prayerTimes).map(
        ([prayerName, time]) => ({
          prayerName: prayerName as PrayerName,
          iqamaTime: String(time),
        })
      )
      console.log('Auto-filled jamat times:', jamatTimes)

      // Reuse createSchedule → ensures status & createdBy
      return this.createSchedule(
        {
          mosqueId: body.mosqueId,
          date: body.date,
          jamatTimes,
        },
        { role: user.role as UserRole, mosqueId: body.mosqueId, _id: user._id }
      )
    } catch (error: any) {
      throw new Error('Failed to auto-fill jamat times: ' + error.message)
    }
  }

  // ✅ Delete a schedule completely
  async deleteSchedule(id: string, user: CurrentUser) {
    const jamat = await this.jamatModel.findById(id)
    if (!jamat) throw new NotFoundException('Jamat schedule not found')

    this.assertSameMosqueOrAdmin(user, jamat.mosqueId)

    await this.jamatModel.findByIdAndDelete(id)
    return { message: 'Jamat schedule deleted successfully' }
  }

  // ✅ Utility: fetch one jamat schedule
  async getJamatTimes(mosqueId: string, date: string) {
    return this.getSchedule(mosqueId, date)
  }

  // ✅ Approve a schedule (admin or mosqueAuthority)
  async approveSchedule(id: string, user: CurrentUser) {
    const jamat = await this.jamatModel.findById(id)
    if (!jamat) throw new NotFoundException('Jamat schedule not found')

    this.assertSameMosqueOrAdmin(user, jamat.mosqueId)

    if (jamat.status === JamatStatus.APPROVED) return jamat

    jamat.status = JamatStatus.APPROVED
    await jamat.save()
    return jamat
  }
}
