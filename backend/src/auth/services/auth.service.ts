// src/auth/services/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { RegisterDto, LoginDto } from '../../dtos/auth.dto'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../../users/schemas/user.schema'
import { UserRole } from '../roles.enum'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email })
    if (exists) throw new ConflictException('Email already exists')
    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const role = dto.role ?? UserRole.USER // default role
    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      role,
    })
    return { id: user._id, email: user.email, role: user.role, name: user.name, mosqueId: user.mosqueId}
  }

  // Used by LocalAuthGuard -> LocalStrategy.validate()
  async login(user: any) {
    const payload = {
      sub: user._id.toString(),
      role: user.role,
      mosqueId: user.mosqueId?.toString(),
    }
    return { access_token: await this.jwt.signAsync(payload) }
  }

  // If not using LocalStrategy:
  async loginWithCredentials(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email })
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const ok = await bcrypt.compare(dto.password, user.password)
    if (!ok) throw new UnauthorizedException('Invalid credentials')
    return this.login(user)
  }
}
