import { Module } from '@nestjs/common';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorProfileService } from './doctor-profile.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DoctorProfileController],
  providers: [DoctorProfileService, PrismaService],
  exports: [DoctorProfileService],
})
export class DoctorProfileModule {}

