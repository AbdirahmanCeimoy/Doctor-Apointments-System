import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { DayOfWeek } from '../../../generated/prisma/enums';

export class CreateTimeSlotDto {
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsString()
  doctorId: string;
}

