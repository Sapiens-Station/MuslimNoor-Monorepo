import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class BlockJamatDto {
  @IsString()
  @IsNotEmpty()
  mosqueId: string

  @IsString()
  @IsNotEmpty()
  startDate: string   // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  fajr: string

  @IsString()
  @IsNotEmpty()
  zuhr: string

  @IsString()
  @IsNotEmpty()
  asr: string

  @IsString()
  @IsNotEmpty()
  maghrib: string

  @IsString()
  @IsNotEmpty()
  esha: string

  @IsString()
  @IsNotEmpty()
  jumuah: string

  @IsOptional()
  @IsString()
  iftar?: string

  @IsOptional()
  @IsString()
  tarabeeh?: string

  @IsOptional()
  @IsString()
  tahajjud?: string
}
