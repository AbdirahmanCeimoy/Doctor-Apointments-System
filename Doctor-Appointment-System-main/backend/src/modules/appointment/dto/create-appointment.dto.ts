import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../../generated/prisma/enums';

export class CreateAppointmentDto {
  @IsDateString()
  appointmentDate: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;
}

