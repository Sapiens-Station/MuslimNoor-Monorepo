import { SetMetadata } from '@nestjs/common'

import { UserRole } from '../roles.enum';
export const ROLES_KEY = 'roles';

// ✅ Create the Roles decorator
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
