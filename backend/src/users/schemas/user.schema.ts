import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export enum UserRole {
  USER = 'user',
  MOSQUE_AUTHORITY = 'mosqueAuthority',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  // 🔥 NEW: hashed refresh token for rotate-on-refresh (optional until user logs in)
  @Prop({ required: false })
  refreshTokenHash?: string

  // Contact number (optional)
  @Prop({ required: false })
  contactNumber?: string

  // Preferred mosque
  @Prop({ type: Types.ObjectId, ref: 'Mosque', required: false })
  mosqueId?: Types.ObjectId

  // Device push tokens (FCM); store multiple for multi-device users
  @Prop({ type: [String], default: [] })
  fcmTokens: string[]

  // Role (default user)
  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
  role: UserRole

  // Favorite packages and events
  @Prop({ type: [Types.ObjectId], ref: 'HajjPackage', default: [] })
  favoriteHajjPackages: Types.ObjectId[]

  @Prop({ type: [Types.ObjectId], ref: 'UmrahPackage', default: [] })
  favoriteUmrahPackages: Types.ObjectId[]

  @Prop({ type: [Types.ObjectId], ref: 'Event', default: [] })
  favoriteEvents: Types.ObjectId[]

  // Optional: store Stripe/PayPal customer ID for recurring donations
  @Prop({ required: false })
  paymentCustomerId?: string
}

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)
