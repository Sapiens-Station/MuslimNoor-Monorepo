// import {
//   IsNotEmpty,
//   IsString,
//   IsOptional,
//   IsDate,
//   IsISO8601,
//   IsDateString,
// } from 'class-validator'

// export class CreateEventDto {
//   @IsNotEmpty()
//   @IsString()
//   title: string

//   @IsOptional()
//   @IsString()
//   description?: string

//   @IsOptional()
//   @IsDateString() // ✅ Ensures valid date format (ISO 8601)
//   timestamp?: string // Allow user to send timestamp or use default

//   @IsOptional()
//   @IsString()
//   location?: string

//   @IsOptional()
//   @IsString()
//   imageUrl: string // ✅ Add this field to match schema
// }




import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsEmail,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

/**
 * Frontend → Backend payload (minimal & robust):
 * - startLocal: "YYYY-MM-DDTHH:mm" (no seconds) in event's local time zone
 * - endLocal:   same format, optional
 * - timeZone:   IANA tz (e.g., "America/Chicago"); if omitted, schema default is used
 *
 * Service should convert (startLocal, endLocal, timeZone) into:
 * - startsAtUtc / endsAtUtc (Date, UTC)
 * - startLocalDate / startLocalTime / endLocalDate / endLocalTime (strings)
 */

export class CreateEventDto {
  // Required
  @IsString()
  @MaxLength(180)
  title: string;

  @Matches(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startLocal must be in "YYYY-MM-DDTHH:mm" (24h) format',
  })
  startLocal: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endLocal must be in "YYYY-MM-DDTHH:mm" (24h) format',
  })
  endLocal?: string;

  @IsOptional() // allowed to omit; schema defaults to America/Chicago
  @IsString()
  timeZone?: string;

  // Location (required at persistence; schema applies default if omitted)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  // Optional presentation fields
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'mapLink must be a valid URL' })
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

  // Registration
  @IsOptional()
  @IsBoolean()
  registration?: boolean;

  @ValidateIf(o => o.registration === true)
  @IsUrl({}, { message: 'registrationLink must be a valid URL when registration is true' })
  registrationLink?: string;

  // Contact
  @IsOptional()
  @IsEmail({}, { message: 'contactEmail must be a valid email address' })
  contactEmail?: string;

  @IsOptional()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'contactPhone must be a valid phone number',
  })
  contactPhone?: string;
}
