import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  location?: string;
}
