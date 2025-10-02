import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Jamat, JamatDocument, JamatStatus } from '../schemas/jamat.schema'
import { UserRole } from 'src/users/schemas/user.schema'
import { startOfDay, addDays } from 'date-fns'
import { generateTenDays } from '../utils/date.util'
import { BlockJamatDto } from '~/dtos/block-jamat.dto'
import dayjs from 'dayjs'

type CurrentUser = {
  _id: string | Types.ObjectId
  role: UserRole
  mosqueId?: string | Types.ObjectId
}

@Injectable()
export class JamatService {
  constructor(
    @InjectModel(Jamat.name) private jamatModel: Model<JamatDocument>
  ) {}

  // ✅ One day schedule
  async getSchedule(mosqueId: string, date: string) {
    const dayKey = new Date(date).toISOString().split('T')[0] // "2025-10-03"
    console.log('Fetching schedule for mosqueId:', mosqueId, 'on date:', dayKey)

    const schedule = await this.jamatModel
      .findOne({
        mosqueId: new Types.ObjectId(mosqueId), // <-- critical fix
        dayKey,
      })
      .lean()
      .exec()

    console.log('schedule', schedule)
    return schedule
  }

  // ✅ 10 consecutive days
  async getTenDays(mosqueId: string, from = new Date().toISOString()) {
    const start = new Date(from).toISOString().split('T')[0] // "2025-10-03"
    const end = addDays(start, 10)
    return this.jamatModel
      .find({
        mosqueId: new Types.ObjectId(mosqueId),
        date: { $gte: start, $lt: end },
      })
      .sort({ date: 1 })
      .lean()
      .exec()
  }

  private assertSameMosqueOrAdmin(
    user: CurrentUser,
    targetMosqueId: Types.ObjectId | string
  ): void {
    let userMosqueId: string | null = null
    const rawUserMosqueId = user.mosqueId

    console.log('Raw User Mosque ID:', rawUserMosqueId)
    console.log('Target Mosque ID:', targetMosqueId)

    if (rawUserMosqueId) {
      if (typeof rawUserMosqueId === 'string') {
        // Extract the ObjectId from the string using the actual pattern in your log
        const objectIdMatch = rawUserMosqueId.match(
          /ObjectId\('([0-9a-fA-F]{24})'\)/
        )
        if (objectIdMatch && objectIdMatch[1]) {
          userMosqueId = objectIdMatch[1]
        } else {
          // If no ObjectId pattern found, check if it's already a plain ID
          userMosqueId = rawUserMosqueId.length === 24 ? rawUserMosqueId : null
        }
      } else if (rawUserMosqueId instanceof Types.ObjectId) {
        userMosqueId = rawUserMosqueId.toHexString()
      } else if (typeof rawUserMosqueId === 'object' && rawUserMosqueId._id) {
        const nestedId = rawUserMosqueId._id
        userMosqueId =
          typeof nestedId === 'string' ? nestedId : nestedId.toHexString()
      }
    }

    // Normalize target ID
    const targetId =
      typeof targetMosqueId === 'string'
        ? targetMosqueId
        : targetMosqueId.toHexString()

    console.log('Normalized userMosqueId:', userMosqueId)
    console.log('Normalized targetId:', targetId)
    console.log('Comparison result:', userMosqueId === targetId)

    if (!userMosqueId || userMosqueId !== targetId) {
      throw new ForbiddenException('Cannot act on another mosque')
    }
  }

  // ✅ Create new 10-day block
  async createTenDaysSchedule(body: BlockJamatDto, user: CurrentUser) {
    this.assertSameMosqueOrAdmin(user, body.mosqueId)

    // Canonical starting dayKey
    const startDayKey = dayjs(body.startDate).format('YYYY-MM-DD')
    const days = generateTenDays(startDayKey)

    // Remove old block by dayKey
    await this.jamatModel.deleteMany({
      mosqueId: body.mosqueId,
      dayKey: { $gte: startDayKey, $lte: days[days.length - 1].dayKey },
    })

    // Build new docs
    const docs: Partial<Jamat>[] = days.map((d) => ({
      mosqueId: new Types.ObjectId(body.mosqueId),
      date: d.date, // still store a Date
      dayKey: d.dayKey, // canonical key
      fajr: body.fajr,
      zuhr: body.zuhr,
      asr: body.asr,
      maghrib: body.maghrib,
      esha: body.esha,
      jumuah: body.jumuah,
      iftar: body.iftar,
      tarabeeh: body.tarabeeh,
      tahajjud: body.tahajjud,
      createdBy: new Types.ObjectId(user._id),
      status: JamatStatus.PENDING,
    }))

    return this.jamatModel.insertMany(docs)
  }

  // ✅ Replace existing 10-day block
  async updateTenDaysSchedule(body: BlockJamatDto, user: CurrentUser) {
    return this.createTenDaysSchedule(body, user) // same flow
  }

  // ✅ Approve schedule
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
