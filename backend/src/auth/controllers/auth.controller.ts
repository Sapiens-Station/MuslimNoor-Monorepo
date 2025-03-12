import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local')) // Uses LocalStrategy before login
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
