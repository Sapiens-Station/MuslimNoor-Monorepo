import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export enum JamatStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

@Schema({ timestamps: true })
export class Jamat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Mosque', required: true })
  mosqueId: Types.ObjectId

  @Prop({ type: Date, required: true })
  date: Date

  @Prop({ type: String })
  dayKey?: string

  // Fixed fields for each prayer
  @Prop({ type: String, required: true }) fajr: string
  @Prop({ type: String, required: true }) zuhr: string
  @Prop({ type: String, required: true }) asr: string
  @Prop({ type: String, required: true }) maghrib: string
  @Prop({ type: String, required: true }) esha: string
  @Prop({ type: String, required: true }) jumuah: string

  @Prop({ type: String }) iftar?: string
  @Prop({ type: String }) tarabeeh?: string
  @Prop({ type: String }) tahajjud?: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId

  @Prop({
    type: String,
    enum: Object.values(JamatStatus),
    default: JamatStatus.PENDING,
  })
  status: JamatStatus
}

export type JamatDocument = Jamat & Document
export const JamatSchema = SchemaFactory.createForClass(Jamat)

// Ensure one schedule per mosque per day
JamatSchema.index({ mosqueId: 1, date: 1 }, { unique: true })
