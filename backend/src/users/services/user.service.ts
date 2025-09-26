import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserRole, UserDocument } from '../schemas/user.schema'
import { UpdateUserDto } from 'src/dtos/update-user.dto'
import * as bcrypt from 'bcryptjs'
import { UserResponseDto } from '~/dtos/user.response.dto'
import { CreateUserDto } from '~/dtos/create-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument | null>) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().select('-password').exec()
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch users')
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userModel
        .findById(new Types.ObjectId(id))
        .select('-password')
        .populate('mosqueId')

      if (!user) throw new NotFoundException('User not found')
      return this.toResponse(user)
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch user by ID')
    }
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('+password')
        .populate('mosqueId')

      if (!user) throw new NotFoundException('User not found')
      return {
        ...this.toResponse(user),
        password: user.password,
      } as UserResponseDto & { password: string }
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch user by email')
    }
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).populate('mosqueId').exec()
  }

  async findByMosque(mosqueId: string): Promise<User[]> {
    try {
      return await this.userModel.find({ mosqueId }).select('-password').exec()
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch mosque users')
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      if (dto.password) {
        dto.password = await bcrypt.hash(dto.password, 10)
      }
      const updated = await this.userModel
        .findByIdAndUpdate(id, dto, { new: true })
        .select('-password')
      if (!updated) throw new NotFoundException('User not found')
      return updated
    } catch (err) {
      throw new InternalServerErrorException('Failed to update user')
    }
  }

  async createUser(dto: CreateUserDto
  ): Promise<UserDocument | null> {
    try {
      // Check if email already exists
      const existing = await this.userModel
        .findOne({ email: dto.email })
        .exec()
      if (existing) {
        throw new ConflictException('User with this email already exists')
      }

      // Hash password
      const hashed = await bcrypt.hash(dto.password, 10)

      // Validate mosqueId if provided
      let mosqueObjectId: Types.ObjectId | undefined
      if (dto.mosqueId) {
        if (!Types.ObjectId.isValid(dto.mosqueId)) {
          throw new BadRequestException('Invalid mosqueId')
        }
        mosqueObjectId = new Types.ObjectId(dto.mosqueId)
      }

      // Create new user
      const newUser = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password: hashed,
        mosqueId: dto.mosqueId ? new Types.ObjectId(dto.mosqueId) : undefined,
        role: dto.role ?? UserRole.USER,
      })

      return newUser
    } catch (err: any) {
      // Handle known Mongo errors
      if (err.code === 11000) {
        throw new ConflictException('Email already exists')
      }

      if (
        err instanceof ConflictException ||
        err instanceof BadRequestException
      ) {
        throw err
      }

      console.error('Error creating user:', err)
      throw new InternalServerErrorException('Unexpected error creating user')
    }
  }

  async updateRole(userId: string, role: UserRole): Promise<UserDocument | null> {
    try {
      const updated = await this.userModel
        .findByIdAndUpdate(userId, { role }, { new: true })
        .select('-password')
      if (!updated) throw new NotFoundException('User not found')
      return updated
    } catch (err) {
      throw new InternalServerErrorException('Failed to update role')
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      await this.userModel.findByIdAndDelete(id)
      return { message: 'User deleted successfully' }
    } catch (err) {
      throw new InternalServerErrorException('Failed to delete user')
    }
  }

  async addFcmToken(userId: string, token: string): Promise<UserDocument | null> {
    try {
      const updated = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $addToSet: { fcmTokens: token } },
          { new: true }
        )
        .select('-password')
      if (!updated) throw new NotFoundException('User not found')
      return updated
    } catch (err) {
      throw new InternalServerErrorException('Failed to add FCM token')
    }
  }

  async getFavorites(userId: string) {
    try {
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
    } catch (err) {
      throw new InternalServerErrorException('Failed to get favorites')
    }
  }

  async addFavoriteHajj(userId: string, packageId: string): Promise<UserDocument | null> {
    try {
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { favoriteHajjPackages: new Types.ObjectId(packageId) },
          },
          { new: true }
        )
        .select('-password')
    } catch (err) {
      throw new InternalServerErrorException('Failed to add Hajj favorite')
    }
  }

  async addFavoriteUmrah(userId: string, packageId: string): Promise<UserDocument | null> {
    try {
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { favoriteUmrahPackages: new Types.ObjectId(packageId) },
          },
          { new: true }
        )
        .select('-password')
    } catch (err) {
      throw new InternalServerErrorException('Failed to add Umrah favorite')
    }
  }

  async addFavoriteEvent(userId: string, eventId: string): Promise<UserDocument | null> {
    try {
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          { $addToSet: { favoriteEvents: new Types.ObjectId(eventId) } },
          { new: true }
        )
        .select('-password')
    } catch (err) {
      throw new InternalServerErrorException('Failed to add Event favorite')
    }
  }

  private toResponse(user: any): UserResponseDto {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      mosqueId: user.mosqueId ?? undefined,
      fcmTokens: user.fcmTokens ?? [],
      role: user.role,
      favoriteHajjPackages: user.favoriteHajjPackages ?? [],
      favoriteUmrahPackages: user.favoriteUmrahPackages ?? [],
      favoriteEvents: user.favoriteEvents ?? [],
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, hash)
    } catch {
      throw new InternalServerErrorException('Password verification failed')
    }
  }

  // 🔐 Refresh token helpers
  async setRefreshToken(
    userId: string,
    refreshTokenHash: string
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash }).exec()
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } })
      .exec()
  }

  async getRefreshTokenHash(userId: string): Promise<string | undefined> {
    const doc = await this.userModel
      .findById(userId)
      .select('refreshTokenHash')
      .lean()
    return doc?.refreshTokenHash
  }
}
