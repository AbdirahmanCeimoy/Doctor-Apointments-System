import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsString()
  specialization: string;

  @IsString()
  qualifications: string;

  @IsNumber()
  @Min(0)
  experience: number;

  @IsNumber()
  @Min(0)
  consultationFee: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsString()
  licenseNumber: string;

  @IsString()
  userId: string;
}

