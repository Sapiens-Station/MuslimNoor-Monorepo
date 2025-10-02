import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { LoginDto, RegisterDto } from '~/dtos/auth.dto'
import { UserService } from '~/users/services/user.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.createUser(registerDto)
    return { message: 'User created successfully', user }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateUserAndGetTokens(loginDto)
  }

  // @Post('refresh')
  // async refresh(@Body('refreshToken') refreshToken: string) {
  //   if (!refreshToken) {
  //     throw new UnauthorizedException('Missing refresh token')
  //   }
  //   return this.authService.refreshTokens(refreshToken)
  // }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    await this.authService.logout(req.user._id)
    return { message: 'Logged out successfully' }
  }
}
