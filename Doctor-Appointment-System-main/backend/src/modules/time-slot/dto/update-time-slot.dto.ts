import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeSlotDto } from './create-time-slot.dto';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { DayOfWeek } from '../../../generated/prisma/enums';

export class UpdateTimeSlotDto extends PartialType(CreateTimeSlotDto) {
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

