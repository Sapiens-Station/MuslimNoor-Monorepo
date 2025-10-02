import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Event, EventDocument } from '../schemas/event.schema'
import { UpdateEventDto } from 'src/dtos/update-event.dto'
import { CreateEventDto } from 'src/dtos/create-event.dto'
import { DateTime } from 'luxon'
import { UserRole } from 'src/users/schemas/user.schema'

@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>
  ) {}

  private computeTimes(params: {
    startLocal: string
    endLocal?: string
    timeZone?: string
  }) {
    const tz = params.timeZone || 'America/Chicago'
    const start = DateTime.fromISO(params.startLocal, { zone: tz })
    if (!start.isValid) throw new Error('Invalid startLocal or timeZone')

    const end = params.endLocal
      ? DateTime.fromISO(params.endLocal, { zone: tz })
      : null
    if (params.endLocal && !end?.isValid) {
      throw new Error('Invalid endLocal or timeZone')
    }

    // derive values
    const startLocalDate = start.toFormat('yyyy-LL-dd')
    const startLocalTime = start.toFormat('HH:mm')

    return {
      startsAtUtc: start.toUTC().toJSDate(),
      endsAtUtc: end ? end.toUTC().toJSDate() : undefined,

      startLocalDate,
      startLocalTime,
      endLocalDate: end ? end.toFormat('yyyy-LL-dd') : undefined,
      endLocalTime: end ? end.toFormat('HH:mm') : undefined,

      // ✅ key for fast daily queries
      dayKey: startLocalDate,

      timeZone: tz,
    }
  }

  /** Create event */
  async create(
    dto: CreateEventDto,
    user: { role: string; mosqueId?: string | { _id: string; name?: string } }
  ): Promise<Event> {
    const times = this.computeTimes({
      startLocal: dto.startLocal,
      endLocal: dto.endLocal,
      timeZone: dto.timeZone,
    })

    // 🔑 Role enforcement
    let mosqueId: Types.ObjectId
    if (user.role === UserRole.MOSQUE_AUTHORITY) {
      if (!user.mosqueId)
        throw new ForbiddenException('MosqueAuthority must have a mosqueId')
      const rawId =
        typeof user.mosqueId === 'object' ? user.mosqueId._id : user.mosqueId
      mosqueId = new Types.ObjectId(rawId)
    } else if (user.role === UserRole.ADMIN) {
      if (!dto.mosqueId)
        throw new ForbiddenException('Admin must provide mosqueId')
      mosqueId = new Types.ObjectId(dto.mosqueId)
    } else {
      throw new ForbiddenException(
        'Only Admin or MosqueAuthority can create events'
      )
    }

    const event = new this.eventModel({
      title: dto.title.trim(),
      ...times, // ✅ includes startsAtUtc, endsAtUtc, startLocalDate, startLocalTime, endLocalDate, endLocalTime, dayKey, timeZone
      mosqueId,
      location: dto.location?.trim() || 'Norman Mosque',
      mapLink: dto.mapLink?.trim(),
      subtitle: dto.subtitle?.trim(),
      description: dto.description?.trim(),
      specialGuest: dto.specialGuest?.trim(),
      food: dto.food?.trim(),
      ageGroup: dto.ageGroup?.trim(),
      registration: dto.registration ?? false,
      registrationLink: dto.registration
        ? dto.registrationLink?.trim()
        : undefined,
      contactEmail: dto.contactEmail?.trim(),
      contactPhone: dto.contactPhone?.trim(),
    })

    return event.save()
  }

  async findAll(mosqueId?: string): Promise<Event[]> {
    const query = mosqueId ? { mosqueId: new Types.ObjectId(mosqueId) } : {}
    return this.eventModel
      .find(query)
      .populate('mosqueId', '_id name')
      .sort({ startsAtUtc: 1 })
      .exec()
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate('mosqueId', '_id name') // ✅ only _id + name
      .exec()
    if (!event) throw new NotFoundException('Event not found')
    return event
  }

    findToday(mosqueId: string | undefined, limit = 5): Promise<Event[]> {
    const now = new Date()
    const startOfDay = new Date(now.setHours(0, 0, 0, 0))
    const endOfDay = new Date(now.setHours(23, 59, 59, 999))

    const query: any = {
      startsAtUtc: { $gte: startOfDay, $lte: endOfDay },
    }

    if (mosqueId) {
      query.mosqueId = new Types.ObjectId(mosqueId)
    }

    return this.eventModel
      .find(query)
      .populate('mosqueId', '_id name')
      .sort({ startsAtUtc: 1 })
      .limit(limit)
      .exec()
  }

  async findUpcoming(mosqueId?: string, limit = 5): Promise<Event[]> {
    const now = new Date()
    const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 50)

    const baseQuery: any = {
      $or: [
        { startsAtUtc: { $gte: now } }, // future
        { endsAtUtc: { $gte: now } }, // ongoing
      ],
    }

    if (mosqueId) {
      baseQuery.mosqueId = new Types.ObjectId(mosqueId)
    }

    return this.eventModel
      .find(baseQuery)
      .populate('mosqueId', '_id name')
      .sort({ startsAtUtc: 1 })
      .limit(safeLimit)
      .exec()
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const existing = await this.eventModel.findById(id).exec()
    if (!existing) throw new NotFoundException(`Event with ID ${id} not found`)

    const times =
      dto.startLocal || dto.endLocal || dto.timeZone
        ? this.computeTimes({
            startLocal:
              dto.startLocal ??
              `${existing.startLocalDate}T${existing.startLocalTime}`,
            endLocal:
              dto.endLocal ??
              (existing.endLocalDate && existing.endLocalTime
                ? `${existing.endLocalDate}T${existing.endLocalTime}`
                : undefined),
            timeZone: dto.timeZone ?? existing.timeZone,
          })
        : {}

    Object.assign(existing, dto, times)
    return existing.save()
  }

  async delete(id: string): Promise<{ message: string }> {
    const res = await this.eventModel.findByIdAndDelete(id).exec()
    if (!res) throw new NotFoundException(`Event with ID ${id} not found`)
    return { message: 'Event deleted successfully' }
  }
}
