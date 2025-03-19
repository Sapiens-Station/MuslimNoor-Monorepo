import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type PrayerDocument = HydratedDocument<Prayer>;

@Schema({ timestamps: true })
export class Prayer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  time: string; // Example: 'Fajr - 5:30 AM'

  @Prop({ required: true })
  date: string; // Example: '2025-03-18'

  @Prop({ default: 'mosque' })
  location: string;
}

export const PrayerSchema = SchemaFactory.createForClass(Prayer);
