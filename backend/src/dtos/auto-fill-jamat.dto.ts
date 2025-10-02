// src/jamats/dtos/auto-fill-jamat.dto.ts

import { IsNotEmpty, IsMongoId, IsNumber, IsString } from 'class-validator';

export class AutoFillJamatDto {
  @IsMongoId()
  @IsNotEmpty()
  mosqueId: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;

  @IsString()
  @IsNotEmpty()
  date: string; // "YYYY-MM-DD"
}
