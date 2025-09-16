import { IsString } from 'class-validator';

export class AssignAuthorityDto {
  @IsString()
  userId: string;
}
