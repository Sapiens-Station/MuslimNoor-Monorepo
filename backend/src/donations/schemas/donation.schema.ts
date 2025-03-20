import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type DonationDocument = HydratedDocument<Donation>;

@Schema({ timestamps: true })
export class Donation extends Document {
  @Prop({ required: true })
  donorName: string;

  @Prop()
  donorEmail?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  paymentMethod: string; // e.g., PayPal, Bank Transfer

  @Prop()
  receiptUrl?: string; // URL to a digital receipt

  @Prop()
  message?: string;

  @Prop({ required: true }) // ✅ Store full timestamp
  timestamp: Date;

  @Prop({ default: 'general' }) // Can be 'zakat', 'sadaqah', etc.
  category: string;

  @Prop({ default: 'pending' }) // Status: 'pending', 'confirmed'
  status: string;

  @Prop({ default: false })
  anonymous?: boolean;

  @Prop({ default: false })
  verifiedByAdmin?: boolean;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
