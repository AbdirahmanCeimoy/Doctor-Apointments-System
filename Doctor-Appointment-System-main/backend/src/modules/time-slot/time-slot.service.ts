import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { TimeSlot } from '../../generated/prisma/client';

@Injectable()
export class TimeSlotService {
  constructor(private prismaService: PrismaService) {}

  async create(createTimeSlotDto: CreateTimeSlotDto): Promise<TimeSlot> {
    // Check if doctor profile exists
    const doctorProfile = await this.prismaService.prisma.doctorProfile.findUnique({
      where: { id: createTimeSlotDto.doctorId },
    });

    if (!doctorProfile) {
      throw new NotFoundException(`Doctor profile with ID ${createTimeSlotDto.doctorId} not found`);
    }

    return this.prismaService.prisma.timeSlot.create({
      data: createTimeSlotDto,
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<TimeSlot[]> {
    return this.prismaService.prisma.timeSlot.findMany({
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<TimeSlot> {
    const timeSlot = await this.prismaService.prisma.timeSlot.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!timeSlot) {
      throw new NotFoundException(`Time slot with ID ${id} not found`);
    }

    return timeSlot;
  }

  async findByDoctorId(doctorId: string): Promise<TimeSlot[]> {
    // Check if doctor profile exists
    const doctorProfile = await this.prismaService.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
    });

    if (!doctorProfile) {
      throw new NotFoundException(`Doctor profile with ID ${doctorId} not found`);
    }

    return this.prismaService.prisma.timeSlot.findMany({
      where: { doctorId },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async update(id: string, updateTimeSlotDto: UpdateTimeSlotDto): Promise<TimeSlot> {
    // Check if time slot exists
    await this.findOne(id);

    return this.prismaService.prisma.timeSlot.update({
      where: { id },
      data: updateTimeSlotDto,
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Check if time slot exists
    await this.findOne(id);

    await this.prismaService.prisma.timeSlot.delete({
      where: { id },
    });
  }
}

