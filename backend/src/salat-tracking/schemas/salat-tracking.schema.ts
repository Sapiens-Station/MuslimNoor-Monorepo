import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class SalatTracking {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  prayerName: string;

  @Prop({ required: true, enum: ['on_time', 'late', 'missed'] })
  status: string;

  @Prop({ default: () => new Date().toISOString().slice(0, 10) })
  date: string;
}

export type SalatTrackingDocument = SalatTracking & Document;
export const SalatTrackingSchema = SchemaFactory.createForClass(SalatTracking);
