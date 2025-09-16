import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { MosqueService } from '../services/mosque.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/user.schema';
import { CreateMosqueDto } from 'src/dtos/create-mosque.dto';
import { UpdateMosqueDto } from 'src/dtos/update-mosque.dto';
import { AssignAuthorityDto } from 'src/dtos/assign-authority.dto';

@Controller('mosques')
export class MosquesController {
  constructor(private readonly mosqueService: MosqueService) {}

  // ✅ Public: Get all mosques (for dropdowns, registration, etc.)
  @Get()
  findAll() {
    return this.mosqueService.findAll();
  }

  // ✅ Public: Get single mosque details
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mosqueService.findById(id);
  }

  // ✅ Admin: Create mosque
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateMosqueDto) {
    return this.mosqueService.create(dto);
  }

  // ✅ Admin or mosqueAuthority: Update mosque
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MOSQUE_AUTHORITY)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMosqueDto,
    @Req() req: any,
  ) {
    if (
      req.user.role === UserRole.MOSQUE_AUTHORITY &&
      req.user.mosqueId.toString() !== id
    ) {
      throw new ForbiddenException('Cannot update another mosque’s info');
    }
    return this.mosqueService.update(id, dto);
  }

  // ✅ Admin: Delete mosque
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mosqueService.delete(id);
  }

  // ✅ Admin & mosqueAuthority: List users of this mosque
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MOSQUE_AUTHORITY)
  @Get(':id/users')
  getMosqueUsers(@Param('id') id: string, @Req() req: any) {
    return this.mosqueService.getMosqueUsers(id, req.user);
  }

  // ✅ Admin: Assign mosque authority to a user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/assign-authority')
  assignAuthority(
    @Param('id') mosqueId: string,
    @Body() dto: AssignAuthorityDto,
  ) {
    return this.mosqueService.assignAuthority(mosqueId, dto.userId);
  }
}
