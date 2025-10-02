import { Mosque } from '~/mosques/schemas/mosque.schema';

export class UserResponseDto {
  _id: string;
  name: string;
  email: string;
  mosqueId?: string | Mosque// instead of string
  fcmTokens: string[];
  role: string;
  contactNumber: string;
  favoriteHajjPackages: string[];
  favoriteUmrahPackages: string[];
  favoriteEvents: string[];
  createdAt: Date;
  updatedAt: Date;
}
