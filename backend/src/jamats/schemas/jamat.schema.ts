import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Jamat extends Document {
  @Prop({ required: true })
  mosqueId: string;
  
  @Prop({ required: true })
  date: string; 

  @Prop({
    type: [{
      prayerName: { type: String, required: true },
      time: { type: String, required: true },
    }],
  })
  jamatTimes: { prayerName: string; time: string }[];
}

export const JamatSchema = SchemaFactory.createForClass(Jamat);