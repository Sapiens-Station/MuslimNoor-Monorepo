import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type DonationDocument = HydratedDocument<Donation>;
@Schema({ timestamps: true })
export class Donation extends Document {
  @Prop({ required: true })
  donorName: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'general' }) // Can be 'zakat', 'sadaqah', etc.
  category: string;

  @Prop({ default: 'pending' }) // Status: 'pending', 'confirmed'
  status: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
