import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type PrayerDocument = HydratedDocument<Prayer>;

export enum PrayerName {
  FAJR = 'Fajr',
  DHUHR = 'Dhuhr',
  ASR = 'Asr',
  MAGHRIB = 'Maghrib',
  ISHA = 'Isha',
}

@Schema({ timestamps: true }) // ✅ Automatically adds `createdAt` & `updatedAt`
export class Prayer extends Document {
  @Prop({ required: true, enum: PrayerName }) // ✅ Prayer name using ENUM
  name: PrayerName;

  @Prop({ required: true, type: Date }) // ✅ Stores full timestamp
  timestamp: Date;

  @Prop({ default: 'mosque' })
  location: string; // Example: 'Mosque', 'Home', 'Workplace'

  @Prop({ enum: ['pending', 'completed', 'missed'], default: 'pending' }) // ✅ Tracks performance
  status: string;

  @Prop({ default: '' }) // ✅ Any additional notes about the prayer
  notes?: string;
}

export const PrayerSchema = SchemaFactory.createForClass(Prayer);
