import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'

export type EventDocument = HydratedDocument<Event>
@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string

  @Prop({ required: false })
  description: string

  @Prop({ required: true }) // ✅ Store full timestamp
  timestamp: Date

  @Prop({ required: false })
  location: string

  @Prop({ required: false })
  imageUrl?: string // Store event image
}

export const EventSchema = SchemaFactory.createForClass(Event)
