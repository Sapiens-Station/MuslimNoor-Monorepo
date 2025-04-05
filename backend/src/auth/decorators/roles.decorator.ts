import { SetMetadata } from '@nestjs/common'

// ✅ Define ROLES_KEY as a constant
export const ROLES_KEY = 'roles'

// ✅ Create the Roles decorator
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
