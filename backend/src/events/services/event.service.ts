import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { UpdateEventDto } from 'src/dtos/update-event.dto';
import { CreateEventDto } from 'src/dtos/create-event.dto';
import { DateTime } from 'luxon';
import { UserRole } from 'src/users/schemas/user.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  private computeTimes(params: { startLocal: string; endLocal?: string; timeZone?: string }) {
    const tz = params.timeZone || 'America/Chicago';
    const start = DateTime.fromISO(params.startLocal, { zone: tz });
    if (!start.isValid) throw new Error('Invalid startLocal or timeZone');

    const end = params.endLocal ? DateTime.fromISO(params.endLocal, { zone: tz }) : null;
    if (params.endLocal && !end?.isValid) throw new Error('Invalid endLocal or timeZone');

    return {
      startsAtUtc: start.toUTC().toJSDate(),
      endsAtUtc: end ? end.toUTC().toJSDate() : undefined,
      startLocalDate: start.toFormat('yyyy-LL-dd'),
      startLocalTime: start.toFormat('HH:mm'),
      endLocalDate: end ? end.toFormat('yyyy-LL-dd') : undefined,
      endLocalTime: end ? end.toFormat('HH:mm') : undefined,
      timeZone: tz,
    };
  }

  /** Create event */
  async create(dto: CreateEventDto, user: { role: string; mosqueId?: string }): Promise<Event> {
    const times = this.computeTimes({ startLocal: dto.startLocal, endLocal: dto.endLocal, timeZone: dto.timeZone });

    // 🔑 Role enforcement
    let mosqueId: Types.ObjectId;
    if (user.role === UserRole.MOSQUE_AUTHORITY) {
      mosqueId = new Types.ObjectId(user.mosqueId); // auto-assign
    } else if (user.role === UserRole.ADMIN) {
      if (!dto.mosqueId) throw new ForbiddenException('Admin must provide mosqueId');
      mosqueId = new Types.ObjectId(dto.mosqueId);
    } else {
      throw new ForbiddenException('Only admin or mosqueAuthority can create events');
    }

    const event = new this.eventModel({
      title: dto.title,
      ...times,
      mosqueId,
      location: dto.location,
      mapLink: dto.mapLink,
      subtitle: dto.subtitle,
      description: dto.description,
      specialGuest: dto.specialGuest,
      food: dto.food,
      ageGroup: dto.ageGroup,
      registration: dto.registration ?? false,
      registrationLink: dto.registration ? dto.registrationLink : undefined,
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone,
    });

    return event.save();
  }

  async findAll(mosqueId?: string): Promise<Event[]> {
    const query = mosqueId ? { mosqueId: new Types.ObjectId(mosqueId) } : {};
    return this.eventModel.find(query).sort({ startsAtUtc: 1 }).exec();
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findUpcoming(mosqueId?: string, limit = 5): Promise<Event[]> {
    const now = new Date();
    const query = mosqueId
      ? { mosqueId: new Types.ObjectId(mosqueId), startsAtUtc: { $gte: now } }
      : { startsAtUtc: { $gte: now } };
    return this.eventModel.find(query).sort({ startsAtUtc: 1 }).limit(limit).exec();
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const existing = await this.eventModel.findById(id).exec();
    if (!existing) throw new NotFoundException(`Event with ID ${id} not found`);

    const times = (dto.startLocal || dto.endLocal || dto.timeZone)
      ? this.computeTimes({
          startLocal: dto.startLocal ?? `${existing.startLocalDate}T${existing.startLocalTime}`,
          endLocal: dto.endLocal ?? (existing.endLocalDate && existing.endLocalTime ? `${existing.endLocalDate}T${existing.endLocalTime}` : undefined),
          timeZone: dto.timeZone ?? existing.timeZone,
        })
      : {};

    Object.assign(existing, dto, times);
    return existing.save();
  }

  async delete(id: string): Promise<{ message: string }> {
    const res = await this.eventModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Event with ID ${id} not found`);
    return { message: 'Event deleted successfully' };
  }
}
