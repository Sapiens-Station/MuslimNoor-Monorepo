// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from '../services/auth.service'
import { LoginDto, RegisterDto } from '~/dtos/auth.dto'
import { User } from '~/users/schemas/user.schema'
import { UserService } from '~/users/services/user.service'

@Controller('auth')
export class AuthController {
  // Temporary, replace with proper injection
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // call user service
    const user = await this.userService.createUser(registerDto)
    return { message: 'User created successfully', user }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.validateUserAndGetTokens(loginDto)

    const isSecure = process.env.COOKIE_SECURE === 'true'

    // Access token (short)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15, // 15m typical
      path: '/',
    })

    // Refresh token (longer)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d or as configured
      path: '/',
    })

    return { user }
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const rt = req.cookies?.refreshToken
    if (!rt) {
      throw new UnauthorizedException('Missing refresh token') // ✅ Let Nest handle JSON
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(rt)

    const isSecure = process.env.COOKIE_SECURE === 'true'

    // Set new cookies (rotate)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
      path: '/',
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    })

    return { message: 'Refreshed' } // ✅ Plain object, no res.json()
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const at = (req as any).user?.sub || (req as any).user?._id
    // If you don’t run this behind JwtGuard, you can also decode refresh for user id if needed.
    // Safer path: don’t rely on req.user here; just clear cookies and best-effort remove refresh token.
    // If you want guaranteed removal, consider a protected /auth/logout that requires access token.

    const isSecure = process.env.COOKIE_SECURE === 'true'

    // Clear cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
    })
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
    })

    // Best effort: if user id is available, remove stored refresh hash
    if (at) {
      try {
        await this.authService.logout(at)
      } catch {}
    }

    return { message: 'Logged out successfully' }
  }
}
