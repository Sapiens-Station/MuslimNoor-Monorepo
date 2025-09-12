import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserRole, UserDocument } from '../schemas/user.schema'
import { UpdateUserDto } from 'src/dtos/update-user.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Return all users (admin only)
  findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec()
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel
      .findById(new Types.ObjectId(id))
      .select('-password')
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  // List users by mosque (for mosqueAuthority and admin)
  findByMosque(mosqueId: string): Promise<User[]> {
    return this.userModel.find({ mosqueId }).select('-password').exec()
  }

  // Update user info (name, contactNumber, etc.)
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10)
    }
    const updated = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password')
    if (!updated) throw new NotFoundException('User not found')
    return updated
  }

  async createUser(body: {
    name: string
    email: string
    password: string
    contactNumber?: string
    mosqueId?: string
    role?: UserRole
  }): Promise<User> {
    const existing = await this.userModel.findOne({ email: body.email }).exec()
    if (existing) {
      throw new ConflictException('User with this email already exists')
    }

    const hashed = await bcrypt.hash(body.password, 10)
    const newUser = await this.userModel.create({
      name: body.name,
      email: body.email,
      password: hashed,
      contactNumber: body.contactNumber,
      mosqueId: body.mosqueId ? new Types.ObjectId(body.mosqueId) : undefined,
      role: body.role ?? UserRole.USER,
    })
    return newUser
  }

  // Change role (admin only)
  async updateRole(userId: string, role: UserRole): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(userId, { role }, { new: true })
      .select('-password')
    if (!updated) throw new NotFoundException('User not found')
    return updated
  }

  // Delete a user (admin only)
  async delete(id: string): Promise<{ message: string }> {
    await this.userModel.findByIdAndDelete(id)
    return { message: 'User deleted successfully' }
  }

  // Add or merge a new FCM token for push notifications
  async addFcmToken(userId: string, token: string): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { fcmTokens: token } },
        { new: true }
      )
      .select('-password')
    if (!updated) throw new NotFoundException('User not found')
    return updated
  }

  // Get all favorites (hajj, umrah, and events)
  async getFavorites(userId: string): Promise<{
    favoriteHajjPackages: Types.ObjectId[]
    favoriteUmrahPackages: Types.ObjectId[]
    favoriteEvents: Types.ObjectId[]
  }> {
    const user = await this.userModel
      .findById(userId)
      .select('favoriteHajjPackages favoriteUmrahPackages favoriteEvents')
      .lean()
    if (!user) throw new NotFoundException('User not found')
    return {
      favoriteHajjPackages: user.favoriteHajjPackages ?? [],
      favoriteUmrahPackages: user.favoriteUmrahPackages ?? [],
      favoriteEvents: user.favoriteEvents ?? [],
    }
  }

  // Add a Hajj package to favorites (no duplicates)
  async addFavoriteHajj(userId: string, packageId: string): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favoriteHajjPackages: new Types.ObjectId(packageId) } },
        { new: true }
      )
      .select('-password')
    if (!updated) throw new NotFoundException('User not found')
    return updated
  }

  // Add an Umrah package to favorites (no duplicates)
  async addFavoriteUmrah(userId: string, packageId: string): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favoriteUmrahPackages: new Types.ObjectId(packageId) } },
        { new: true }
      )
      .select('-password')
    if (!updated) throw new NotFoundException('User not found')
    return updated
  }

  // Add an event to favorites (no duplicates)
  async addFavoriteEvent(userId: string, eventId: string): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favoriteEvents: new Types.ObjectId(eventId) } },
        { new: true }
      )
      .select('-password')
    if (!updated) throw new NotFoundException('User not found')
    return updated
  }
}
