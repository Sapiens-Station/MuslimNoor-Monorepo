import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Event, EventDocument } from '../schemas/event.schema'
import { UpdateEventDto } from 'src/dtos/update-event.dto'
import { CreateEventDto } from 'src/dtos/create-event.dto'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel(createEventDto)
    return event.save()
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec()
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec() // ✅ Always use `.exec()` for better debugging
    if (!event) throw new NotFoundException('Event not found')
    return event
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const updateEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec()

    if (!updateEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`)
    }

    return updateEvent
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.eventModel.findByIdAndDelete(id)
    return { message: 'Event deleted successfully' }
  }
}
