import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.id);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }
}
