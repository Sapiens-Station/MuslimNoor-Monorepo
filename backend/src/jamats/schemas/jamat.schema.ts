// src/jamats/schemas/jamat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PrayerName =
  | 'Fajr'
  | 'Dhuhr'
  | 'Asr'
  | 'Maghrib'
  | 'Isha'
  | 'Jumuah';

@Schema({ timestamps: true })
export class Jamat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Mosque', required: true })
  mosqueId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: [
      {
        prayerName: {
          type: String,
          enum: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Jumuah'],
          required: true,
        },
        iqamaTime: { type: String, required: true },
        azanTime: { type: String },
      },
    ],
  })
  jamatTimes: {
    prayerName: PrayerName;
    iqamaTime: string;
    azanTime?: string;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export type JamatDocument = Jamat & Document;
export const JamatSchema = SchemaFactory.createForClass(Jamat);
