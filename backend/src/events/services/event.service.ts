import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { UpdateEventDto } from 'src/dtos/update-event.dto';
import { CreateEventDto } from 'src/dtos/create-event.dto';
import { DateTime } from 'luxon';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  /**
   * Convert front-end inputs to canonical UTC instants + fast local keys.
   * Accepts explicit values or falls back to existing doc when updating.
   */
  private computeTimes(params: {
    startLocal: string;
    endLocal?: string;
    timeZone?: string;
  }) {
    const tz = params.timeZone || 'America/Chicago';
    const start = DateTime.fromISO(params.startLocal, { zone: tz });
    if (!start.isValid) throw new Error('Invalid startLocal or timeZone');

    const end = params.endLocal
      ? DateTime.fromISO(params.endLocal, { zone: tz })
      : null;
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

  /** Build the object we actually persist (schema fields only). */
  private buildPersistableFromCreate(dto: CreateEventDto) {
    const times = this.computeTimes({
      startLocal: dto.startLocal,
      endLocal: dto.endLocal,
      timeZone: dto.timeZone,
    });

    return {
      // Required & computed
      title: dto.title,
      ...times,

      // Location (let schema default kick in if undefined)
      location: dto.location, // if omitted -> "Norman Mosque" via schema
      mapLink: dto.mapLink,

      // Optional presentation
      subtitle: dto.subtitle,
      description: dto.description,
      specialGuest: dto.specialGuest,
      food: dto.food,
      ageGroup: dto.ageGroup,

      // Registration
      registration: dto.registration ?? false,
      registrationLink:
        dto.registration === true ? dto.registrationLink : undefined,

      // Contact
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone,
    };
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const persistable = this.buildPersistableFromCreate(createEventDto);
    const event = new this.eventModel(persistable);
    return event.save();
  }

  async findAll(): Promise<Event[]> {
    // Sort upcoming first; adjust if you want pagination later
    return this.eventModel.find().sort({ startsAtUtc: 1 }).exec();
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const existing = await this.eventModel.findById(id).exec();
    if (!existing) throw new NotFoundException(`Event with ID ${id} not found`);

    // Determine if we need to recompute time fields
    const startLocal = dto.startLocal ?? `${existing.startLocalDate}T${existing.startLocalTime}`;
    const existingEndLocal = existing.endLocalDate && existing.endLocalTime
      ? `${existing.endLocalDate}T${existing.endLocalTime}`
      : undefined;
    const endLocal = dto.endLocal ?? existingEndLocal;
    const timeZone = dto.timeZone ?? existing.timeZone;

    const shouldRecompute =
      dto.startLocal !== undefined ||
      dto.endLocal !== undefined ||
      dto.timeZone !== undefined;

    const computed = shouldRecompute
      ? this.computeTimes({ startLocal, endLocal, timeZone })
      : null;

    // Build $set / $unset payloads
    const $set: Record<string, any> = {
      // recomputed times if needed
      ...(computed ?? {}),
      // regular fields
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.mapLink !== undefined && { mapLink: dto.mapLink }),
      ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.specialGuest !== undefined && { specialGuest: dto.specialGuest }),
      ...(dto.food !== undefined && { food: dto.food }),
      ...(dto.ageGroup !== undefined && { ageGroup: dto.ageGroup }),
      ...(dto.registration !== undefined && { registration: dto.registration }),
      ...(dto.registrationLink !== undefined && { registrationLink: dto.registrationLink }),
      ...(dto.contactEmail !== undefined && { contactEmail: dto.contactEmail }),
      ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
    };

    const updateOps: any = { $set };

    // If registration is explicitly set to false, drop registrationLink
    if (dto.registration === false) {
      updateOps.$unset = { registrationLink: '' };
    }

    const updated = await this.eventModel
      .findByIdAndUpdate(id, updateOps, { new: true })
      .exec();

    if (!updated) throw new NotFoundException(`Event with ID ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const res = await this.eventModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Event with ID ${id} not found`);
    return { message: 'Event deleted successfully' };
  }
}
