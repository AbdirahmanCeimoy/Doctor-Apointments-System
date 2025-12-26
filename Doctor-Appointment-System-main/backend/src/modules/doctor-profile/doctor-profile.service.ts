import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { DoctorProfile } from '../../generated/prisma/client';

@Injectable()
export class DoctorProfileService {
  constructor(private prismaService: PrismaService) {}

  async create(createDoctorProfileDto: CreateDoctorProfileDto): Promise<DoctorProfile> {
    // Check if user exists
    const user = await this.prismaService.prisma.user.findUnique({
      where: { id: createDoctorProfileDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createDoctorProfileDto.userId} not found`);
    }

    // Check if user already has a doctor profile
    const existingProfile = await this.prismaService.prisma.doctorProfile.findUnique({
      where: { userId: createDoctorProfileDto.userId },
    });

    if (existingProfile) {
      throw new ConflictException('User already has a doctor profile');
    }

    // Check if license number already exists
    const existingLicense = await this.prismaService.prisma.doctorProfile.findUnique({
      where: { licenseNumber: createDoctorProfileDto.licenseNumber },
    });

    if (existingLicense) {
      throw new ConflictException('License number already exists');
    }

    return this.prismaService.prisma.doctorProfile.create({
      data: createDoctorProfileDto,
      include: {
        user: true,
        appointments: true,
        timeSlots: true,
      },
    });
  }

  async findAll(): Promise<DoctorProfile[]> {
    return this.prismaService.prisma.doctorProfile.findMany({
      include: {
        user: true,
        appointments: true,
        timeSlots: true,
      },
    });
  }

  async findOne(id: string): Promise<DoctorProfile> {
    const doctorProfile = await this.prismaService.prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: true,
        appointments: true,
        timeSlots: true,
      },
    });

    if (!doctorProfile) {
      throw new NotFoundException(`Doctor profile with ID ${id} not found`);
    }

    return doctorProfile;
  }

  async findByUserId(userId: string): Promise<DoctorProfile | null> {
    return this.prismaService.prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        appointments: true,
        timeSlots: true,
      },
    });
  }

  async update(id: string, updateDoctorProfileDto: UpdateDoctorProfileDto): Promise<DoctorProfile> {
    // Check if doctor profile exists
    await this.findOne(id);

    // If license number is being updated, check if new license number already exists
    if (updateDoctorProfileDto.licenseNumber) {
      const existingLicense = await this.prismaService.prisma.doctorProfile.findUnique({
        where: { licenseNumber: updateDoctorProfileDto.licenseNumber },
      });

      if (existingLicense && existingLicense.id !== id) {
        throw new ConflictException('License number already exists');
      }
    }

    return this.prismaService.prisma.doctorProfile.update({
      where: { id },
      data: updateDoctorProfileDto,
      include: {
        user: true,
        appointments: true,
        timeSlots: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Check if doctor profile exists
    await this.findOne(id);

    await this.prismaService.prisma.doctorProfile.delete({
      where: { id },
    });
  }
}

