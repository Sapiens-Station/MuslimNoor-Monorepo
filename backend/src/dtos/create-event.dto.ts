import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsEmail,
  Matches,
  MaxLength,
  ValidateIf,
  IsMongoId,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(180)
  title: string;

  @Matches(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startLocal must be in "YYYY-MM-DDTHH:mm" format',
  })
  startLocal: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endLocal must be in "YYYY-MM-DDTHH:mm" format',
  })
  endLocal?: string;

  @IsOptional()
  @IsString()
  timeZone?: string;

  // 🔑 Mosque reference
  @IsOptional() // Admin must provide, MosqueAuthority gets auto-assigned
  @IsMongoId()
  mosqueId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  mapLink?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  specialGuest?: string;

  @IsOptional()
  @IsString()
  food?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  ageGroup?: string;

  @IsOptional()
  @IsBoolean()
  registration?: boolean;

  @ValidateIf(o => o.registration === true)
  @IsUrl()
  registrationLink?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/)
  contactPhone?: string;
}
