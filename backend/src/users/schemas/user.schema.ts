import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, Types } from 'mongoose'

export type UserRole = 'user' | 'admin'

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mosque' })
  mosqueId: string

  @Prop({ required: false })
  fcmToken?: string

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: UserRole

  declare _id: Types.ObjectId // ✅ Correct way to handle _id without errors
}

export const UserSchema = SchemaFactory.createForClass(User)
export type UserDocument = User & Document
