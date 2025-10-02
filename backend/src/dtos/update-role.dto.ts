import { IsEnum, IsMongoId } from 'class-validator';
import { UserRole } from '../auth/roles.enum';

export class UpdateRoleDto {
  @IsMongoId()
  userId: string;

  @IsEnum(UserRole)
  role: UserRole;
}
