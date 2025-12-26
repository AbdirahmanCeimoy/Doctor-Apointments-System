import { IsEmail, IsString, IsOptional, IsDateString } from 'class-validator';

export class SignupDto {
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
}

