import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export enum UserRole {
  USER = 'user',
  MOSQUE_AUTHORITY = 'mosqueAuthority',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  // @Prop({ required: false })
  // refreshTokenHash?: string

  @Prop({ required: false })
  contactNumber?: string

  @Prop({ type: Types.ObjectId, ref: 'Mosque', required: false })
  mosqueId?: Types.ObjectId

  @Prop({ type: [String], default: [] })
  fcmTokens: string[]

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
  role: UserRole

  @Prop({ type: [Types.ObjectId], ref: 'HajjPackage', default: [] })
  favoriteHajjPackages: Types.ObjectId[]

  @Prop({ type: [Types.ObjectId], ref: 'UmrahPackage', default: [] })
  favoriteUmrahPackages: Types.ObjectId[]

  @Prop({ type: [Types.ObjectId], ref: 'Event', default: [] })
  favoriteEvents: Types.ObjectId[]

  @Prop({ required: false })
  paymentCustomerId?: string
}

// ✅ Here we add Document on export
export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)
