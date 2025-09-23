import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common'
import { UserService } from '../services/user.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserRole } from '../schemas/user.schema'
import { UpdateUserDto } from 'src/dtos/update-user.dto'
import { CreateUserDto } from '~/dtos/create-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // 🧑 Purpose: Retrieve the logged-in user's profile (password is excluded)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.userService.findById(req.user._id)
  }

  // 🔧 Purpose: Allow a user to update their own profile (name, contactNumber, etc.)
  @UseGuards(JwtAuthGuard)
  @Put('update')
  updateSelf(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user._id, dto)
  }

  // 🆕 Purpose: Admin creates a new user (name, email, password, optional role/mosqueId/contactNumber)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  createUser(
    @Body() dto: CreateUserDto
  ) {
    return this.userService.createUser(dto)
  }

  // 🗂️ Purpose: List users (mosqueAuthority sees only users in their mosque; admin sees all)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Get()
  findAll(@Req() req: any) {
    const { role, mosqueId } = req.user
    if (role === UserRole.MOSQUE_AUTHORITY) {
      return this.userService.findByMosque(mosqueId)
    }
    return this.userService.findAll()
  }

  // 🔍 Purpose: Get a single user by ID (mosqueAuthority can only see users in their own mosque)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MOSQUE_AUTHORITY, UserRole.ADMIN)
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const user = await this.userService.findById(id)
    if (
      req.user.role === UserRole.MOSQUE_AUTHORITY &&
      req.user.mosqueId?.toString() !== user.mosqueId?.toString()
    ) {
      throw new ForbiddenException('Cannot view another mosque’s user')
    }
    return user
  }

  // ✏️ Purpose: Admin updates any user's profile
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  updateById(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto)
  }

  // 📌 Purpose: Admin changes a user’s role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  changeRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.userService.updateRole(id, role)
  }

  // 🗑️ Purpose: Admin deletes a user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    console.log('Deleting user with ID:', id)
    return this.userService.delete(id)
  }

  // 📱 Purpose: Add a new FCM token for push notifications
  @UseGuards(JwtAuthGuard)
  @Patch('fcm-token')
  async addFcmToken(@Req() req: any, @Body('fcmToken') token: string) {
    return this.userService.addFcmToken(req.user._id, token)
  }

  // 🌟 Purpose: Retrieve all favorites (hajj packages, umrah packages, and events)
  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavorites(@Req() req: any) {
    return this.userService.getFavorites(req.user._id)
  }

  // ➕ Purpose: Add a Hajj package to user’s favorites
  @UseGuards(JwtAuthGuard)
  @Post('favorites/hajj/:packageId')
  addFavoriteHajj(@Req() req: any, @Param('packageId') packageId: string) {
    return this.userService.addFavoriteHajj(req.user._id, packageId)
  }

  // ➕ Purpose: Add an Umrah package to user’s favorites
  @UseGuards(JwtAuthGuard)
  @Post('favorites/umrah/:packageId')
  addFavoriteUmrah(@Req() req: any, @Param('packageId') packageId: string) {
    return this.userService.addFavoriteUmrah(req.user._id, packageId)
  }

  // ➕ Purpose: Add an event to user’s favorites
  @UseGuards(JwtAuthGuard)
  @Post('favorites/event/:eventId')
  addFavoriteEvent(@Req() req: any, @Param('eventId') eventId: string) {
    return this.userService.addFavoriteEvent(req.user._id, eventId)
  }
}
