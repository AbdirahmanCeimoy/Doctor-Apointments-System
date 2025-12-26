import { IsEmail, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

