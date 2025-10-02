import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, maxlength: 180 })
  title: string;

  // Canonical UTC range
  @Prop({ type: Date, required: true, index: true })
  startsAtUtc: Date;

  @Prop({ type: Date, index: true })
  endsAtUtc?: Date;

  // ✅ Derived day key for fast grouping/filtering
  @Prop({ type: String })
  dayKey?: string;

  // Local UI keys (string-based for direct display)
  @Prop({ type: String, required: true })
  startLocalDate: string;

  @Prop({ type: String, required: true })
  startLocalTime: string;

  @Prop({ type: String })
  endLocalDate?: string;

  @Prop({ type: String })
  endLocalTime?: string;

  @Prop({ type: String, required: true, default: 'America/Chicago' })
  timeZone: string;

  // 🔑 Link to mosque
  @Prop({ type: Types.ObjectId, ref: 'Mosque', required: true })
  mosqueId: Types.ObjectId;

  @Prop({ type: String, required: true, default: 'Norman Mosque' })
  location: string;

  @Prop({ type: String })
  mapLink?: string;

  @Prop({ type: String })
  subtitle?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  specialGuest?: string;

  @Prop({ type: String })
  food?: string;

  @Prop({ type: String })
  ageGroup?: string;

  @Prop({ type: Boolean, default: false })
  registration?: boolean;

  @Prop({ type: String })
  registrationLink?: string;

  @Prop({ type: String })
  contactEmail?: string;

  @Prop({ type: String })
  contactPhone?: string;
}

export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);

// 🔍 Indexes for performance
EventSchema.index({ dayKey: 1 });                       // fast by-day queries
EventSchema.index({ startLocalDate: 1, startLocalTime: 1 });
EventSchema.index({ startsAtUtc: 1, endsAtUtc: 1 });
