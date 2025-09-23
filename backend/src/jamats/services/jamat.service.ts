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
import { dayRangeUtc, toDayKey } from '../utils/date.util'

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

  async getSchedule(mosqueId: string, date: string) {
    const { start, end, dayKey } = dayRangeUtc(date)
    // Prefer dayKey; keep date range as a fallback if you keep legacy docs
    const doc =
      (await this.jamatModel.findOne({ mosqueId, dayKey }).lean()) ??
      (await this.jamatModel
        .findOne({ mosqueId, date: { $gte: start, $lt: end } })
        .lean())
    return doc
  }

  async getTenDays(mosqueId: string, from = new Date().toISOString()) {
    const { start } = dayRangeUtc(from)
    const end = new Date(start)
    end.setUTCDate(start.getUTCDate() + 10) // exclusive end
    return this.jamatModel
      .find({
        mosqueId,
        date: { $gte: start, $lt: end },
      })
      .sort({ date: 1 })
      .lean()
      .exec()
  }

  private assertSameMosqueOrAdmin(
    user: CurrentUser,
    targetMosqueId: Types.ObjectId | string
  ) {
    if (user.role === UserRole.MOSQUE_AUTHORITY) {
      const a = String(user.mosqueId ?? '')
      const b = String(targetMosqueId ?? '')
      if (a !== b) throw new ForbiddenException('Cannot act on another mosque')
    }
  }

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
      { mosqueId: body.mosqueId, date: new Date(body.date) },
      {
        mosqueId: new Types.ObjectId(body.mosqueId),
        date: new Date(body.date),
        jamatTimes: body.jamatTimes,
        createdBy: new Types.ObjectId(user._id),
        status: JamatStatus.PENDING, // 🔥 always pending at creation
      },
      { upsert: true, new: true }
    )
  }

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
  // When creating schedules (create / autoFill), ensure status default PENDING
  async autoFillSchedule(
    body: { mosqueId: string; lat: number; lon: number; date: string },
    user: { role: string; mosqueId?: string; _id?: string }
  ) {
    // same permission checks
    // get prayer times...
    const prayerTimes = await this.prayerTimesService.getDailyPrayerTimes(
      body.lat,
      body.lon,
      body.date
    );
    const jamatTimes = Object.entries(prayerTimes)
      .filter(([key, _val]) => key !== 'Sunrise' && key !== 'Sunset' && key !== 'Midnight') // if needed
      .map(([prayerName, time]) => ({
        prayerName: prayerName as PrayerName,
        iqamaTime: String(time),
      }));

    // Use createSchedule upsert pattern, ensuring status pending
    const newOrUpdated = await this.jamatModel.findOneAndUpdate(
      { mosqueId: new Types.ObjectId(body.mosqueId), date: new Date(body.date) },
      {
        mosqueId: new Types.ObjectId(body.mosqueId),
        date: new Date(body.date),
        jamatTimes,
        status: JamatStatus.PENDING,
        createdBy: new Types.ObjectId(user._id),
      },
      { upsert: true, new: true }
    );
    return newOrUpdated;
  }

  async deleteSchedule(id: string, user: CurrentUser) {
    const jamat = await this.jamatModel.findById(id)
    if (!jamat) throw new NotFoundException('Jamat schedule not found')
    this.assertSameMosqueOrAdmin(user, jamat.mosqueId)
    await this.jamatModel.findByIdAndDelete(id)
    return { message: 'Jamat schedule deleted successfully' }
  }

  async getJamatTimes(mosqueId: string, date: string) {
    return this.getSchedule(mosqueId, date)
  }

  // Approve a schedule (requires mosqueAuthority or admin)
  async approveSchedule(
    id: string,
    user: { role: string; mosqueId?: string; _id?: string }
  ) {
    const jamat = await this.jamatModel.findById(id);
    if (!jamat) {
      throw new NotFoundException('Jamat schedule not found');
    }
    if (
      user.role === 'MOSQUE_AUTHORITY' &&
      user.mosqueId?.toString() !== jamat.mosqueId.toString()
    ) {
      throw new ForbiddenException('Cannot approve schedule of another mosque');
    }
    if (jamat.status === JamatStatus.APPROVED) {
      return jamat; // or throw error
    }
    jamat.status = JamatStatus.APPROVED;
    await jamat.save();
    return jamat;
  }
}
