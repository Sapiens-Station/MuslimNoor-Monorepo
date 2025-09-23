// src/jamats/dtos/jamat.dto.ts
import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PrayerNameEnum } from './prayer-name.enum';

export class JamatTimeDto {
  @IsEnum(PrayerNameEnum)
  prayerName: PrayerNameEnum;

  @IsString()
  iqamaTime: string;

  @IsOptional()
  @IsString()
  azanTime?: string;
}

export class UpsertJamatDto {
  @IsMongoId()
  mosqueId: string;

  @IsDateString()
  date: string; // ISO date string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JamatTimeDto)
  jamatTimes: JamatTimeDto[];
}

export class UpdatePrayerDto {
  @IsEnum(PrayerNameEnum)
  prayerName: PrayerNameEnum;

  @IsString()
  iqamaTime: string;
}

export class AutoFillDto {
  @IsMongoId()
  mosqueId: string;

  @IsDateString()
  date: string;

  lat: number;
  lon: number;
}