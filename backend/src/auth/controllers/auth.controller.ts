import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get
} from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }


  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.loginWithCredentials(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return req.user
  }
  
}
