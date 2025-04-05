import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator'
import { PrayerName } from 'src/prayers/schemas/prayer.schema'

export class CreatePrayerDto {
  @IsEnum(PrayerName)
  name: PrayerName

  @IsISO8601() // ✅ Ensure valid timestamp format (YYYY-MM-DDTHH:mm:ss.sssZ)
  timestamp: string // ✅ Timestamp is a string in DTOs

  @IsOptional()
  @IsString()
  location?: string // Example: 'Mosque', 'Home', 'Workplace'

  @IsOptional()
  @IsEnum(['pending', 'completed', 'missed'])
  status?: string

  @IsOptional()
  @IsString()
  notes?: string
}
