import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, maxlength: 180 })
  title: string;

  // Canonical UTC
  @Prop({ type: Date, required: true, index: true })
  startsAtUtc: Date;

  @Prop({ type: Date, index: true })
  endsAtUtc?: Date;

  // Local UI keys
  @Prop({ required: true })
  startLocalDate: string;

  @Prop({ required: true })
  startLocalTime: string;

  @Prop()
  endLocalDate?: string;

  @Prop()
  endLocalTime?: string;

  @Prop({ required: true, default: 'America/Chicago' })
  timeZone: string;

  // 🔑 Link to mosque
  @Prop({ type: Types.ObjectId, ref: 'Mosque', required: true })
  mosqueId: Types.ObjectId;

  @Prop({ required: true, default: 'Norman Mosque' })
  location: string;

  @Prop()
  mapLink?: string;

  @Prop() subtitle?: string;
  @Prop() description?: string;
  @Prop() specialGuest?: string;
  @Prop() food?: string;
  @Prop() ageGroup?: string;

  @Prop({ default: false }) registration?: boolean;
  @Prop() registrationLink?: string;

  @Prop() contactEmail?: string;
  @Prop() contactPhone?: string;
}

export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ startLocalDate: 1, startLocalTime: 1 });
