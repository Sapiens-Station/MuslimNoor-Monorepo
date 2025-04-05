import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Mosque extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  emailId: string

  @Prop({ required: true })
  contactNumber: string

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    required: true,
  })
  location: {
    lat: number
    lon: number
  }
}

export const MosqueSchema = SchemaFactory.createForClass(Mosque)
