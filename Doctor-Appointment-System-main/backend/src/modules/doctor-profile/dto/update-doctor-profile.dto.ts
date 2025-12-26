import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorProfileDto } from './create-doctor-profile.dto';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateDoctorProfileDto extends PartialType(CreateDoctorProfileDto) {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  qualifications?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;
}

