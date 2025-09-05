import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Logger,
  Get
} from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { AuthGuard } from '@nestjs/passport'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    Logger.log('Got into Login', req)
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    Logger.log('Got into Login', req)
    return req.user
  }
  
}
