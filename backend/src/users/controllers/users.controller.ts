import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../services/user.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UpdateUserDto } from "src/dtos/update-user.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UserDocument  } from "../schemas/user.schema";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.id);
  }

  @Put("update")
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("fcm-token")
  async updateFcmToken(
    @CurrentUser() user: UserDocument,
    @Body("fcmToken") fcmToken: string
  ) {
    console.log("USER", user);
    if (!user || !user._id) {
      throw new UnauthorizedException('User not found in request');
    }
  
    const userId = typeof user._id === 'string' ? user._id : user._id.toString();
    return this.userService.update(userId, { fcmToken });
  }
}
