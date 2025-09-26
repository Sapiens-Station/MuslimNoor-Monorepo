// src/auth/services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../../users/services/user.service'
import { LoginDto } from '~/dtos/auth.dto'
import * as bcrypt from 'bcryptjs'

type JwtPayload = { sub: string; role: string; mosqueId?: string }

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  // 🔑 Login: validate & issue tokens (access + refresh)
  async validateUserAndGetTokens(loginDto: LoginDto) {
    try {
      const user = (await this.userService.findByEmailWithPassword(
        loginDto.email
      )) as {
        _id: string
        password: string
        role: string
        mosqueId?: string
        email: string
        name: string
      }
      if (!user) throw new UnauthorizedException('Invalid credentials')

      const valid = await this.userService.verifyPassword(
        loginDto.password,
        user.password
      )
      if (!valid) throw new UnauthorizedException('Invalid credentials')

      const payload = {
        sub: user._id.toString(),
        role: user.role,
        mosqueId: user.mosqueId?.toString(),
      }

      // ✅ Access token (short)
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      })

      // ✅ Refresh token (long, different secret)
      // const refreshToken = this.jwtService.sign(payload, {
      //   secret: process.env.JWT_REFRESH_SECRET,
      //   expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      // })

      // ✅ Store refreshToken hash in DB
      // const hashedRt = await bcrypt.hash(refreshToken, 10)
      // await this.userService.setRefreshToken(user._id.toString(), hashedRt)

      const safeUser = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        mosqueId: user.mosqueId,
      }

      return { user: safeUser, accessToken }
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err
      console.error('[AuthService] Error in login:', err)
      throw new InternalServerErrorException('Login failed')
    }
  }

  // 🔄 Refresh tokens: verify, rotate, return new pair
  // async refreshTokens(rawToken: string) {
  //   let decoded: JwtPayload
  //   try {
  //     decoded = await this.jwtService.verifyAsync<JwtPayload>(rawToken, {
  //       secret: process.env.JWT_REFRESH_SECRET!,
  //     })
  //   } catch {
  //     throw new ForbiddenException('Invalid refresh token')
  //   }

  //   const storedHash = await this.userService.getRefreshTokenHash(decoded.sub)
  //   if (!storedHash) throw new ForbiddenException('No refresh token on record')

  //   const matches = await bcrypt.compare(rawToken, storedHash)
  //   if (!matches) throw new ForbiddenException('Refresh token mismatch')

  //   const payload: JwtPayload = {
  //     sub: decoded.sub,
  //     role: decoded.role,
  //     mosqueId: decoded.mosqueId,
  //   }

  //   const accessToken = await this.signAccessToken(payload)
  //   const refreshToken = await this.signRefreshToken(payload)

  //   await this.userService.setRefreshToken(
  //     decoded.sub,
  //     await bcrypt.hash(refreshToken, 10)
  //   )

  //   return { accessToken, refreshToken }
  // }

  async logout(userId: string): Promise<void> {
    // await this.userService.removeRefreshToken(userId)
    return;
  }

  // private async signAccessToken(payload: JwtPayload): Promise<string> {
  //   return this.jwtService.signAsync(payload, {
  //     secret: process.env.JWT_SECRET!,
  //     expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  //   })
  // }

  // private async signRefreshToken(payload: JwtPayload): Promise<string> {
  //   return this.jwtService.signAsync(payload, {
  //     secret: process.env.JWT_REFRESH_SECRET!,
  //     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  //   })
  // }
}
