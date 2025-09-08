// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, HydratedDocument } from 'mongoose'

// export type EventDocument = HydratedDocument<Event>
// @Schema({ timestamps: true })
// export class Event extends Document {
//   @Prop({ required: true })
//   title: string

//   @Prop({ required: false })
//   description: string

//   @Prop({ required: true }) // ✅ Store full timestamp
//   timestamp: Date

//   @Prop({ required: false })
//   location: string

//   @Prop({ required: false })
//   imageUrl?: string // Store event image
// }

// export const EventSchema = SchemaFactory.createForClass(Event)


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Best-practice storage:
 * - Canonical UTC instants: startsAtUtc / endsAtUtc (Date) → easy sorting & "upcoming" filters
 * - Local keys for UI: startLocalDate (YYYY-MM-DD), startLocalTime (HH:mm), etc.
 * - Keep IANA timeZone ("America/Chicago") to correctly interpret local times
 *
 * NOTE: Compute these fields in your service from (startLocal, endLocal, timeZone).
 * The schema enforces presence & formats; it does not do conversions.
 */

@Schema({ timestamps: true })
export class Event {
  // ==== Required basics ====
  @Prop({ required: true, maxlength: 180 })
  title: string;

  // Canonical instants (UTC)
  @Prop({ type: Date, required: true, index: true })
  startsAtUtc: Date;

  @Prop({ type: Date, index: true })
  endsAtUtc?: Date;

  // Local keys (string formats for fast lookups and clean UI)
  @Prop({ required: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true })
  startLocalDate: string; // e.g., "2025-09-27"

  @Prop({ required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ })
  startLocalTime: string; // e.g., "12:00"

  @Prop({ match: /^\d{4}-\d{2}-\d{2}$/ })
  endLocalDate?: string;  // optional if no explicit end

  @Prop({ match: /^([01]\d|2[0-3]):[0-5]\d$/ })
  endLocalTime?: string;  // optional if no explicit end

  @Prop({ required: true, default: 'America/Chicago' })
  timeZone: string;

  // Location
  @Prop({ required: true, default: 'Norman Mosque', maxlength: 120 })
  location: string;

  @Prop()
  mapLink?: string; // URL

  // ==== Optional presentation fields ====
  @Prop({ maxlength: 200 })
  subtitle?: string;

  @Prop()
  description?: string;

  @Prop({ maxlength: 120 })
  specialGuest?: string;

  @Prop()
  food?: string; // e.g., "Boxed lunch & refreshments"

  @Prop({ maxlength: 40 })
  ageGroup?: string; // e.g., "Ages 14+"

  // Registration
  @Prop({ default: false })
  registration?: boolean;

  @Prop()
  registrationLink?: string; // URL

  // Contact
  @Prop()
  contactEmail?: string;

  @Prop()
  contactPhone?: string;
}

export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);

// Helpful compound index for day/time listings
EventSchema.index({ startLocalDate: 1, startLocalTime: 1 });
