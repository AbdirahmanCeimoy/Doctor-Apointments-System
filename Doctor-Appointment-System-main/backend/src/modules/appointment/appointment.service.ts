import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from '../../generated/prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private prismaService: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Check if patient exists
    const patient = await this.prismaService.prisma.user.findUnique({
      where: { id: createAppointmentDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${createAppointmentDto.patientId} not found`);
    }

    // Check if doctor profile exists
    const doctor = await this.prismaService.prisma.doctorProfile.findUnique({
      where: { id: createAppointmentDto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${createAppointmentDto.doctorId} not found`);
    }

    const appointmentData = {
      ...createAppointmentDto,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
    };

    return this.prismaService.prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Appointment[]> {
    return this.prismaService.prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.prismaService.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    // Check if patient exists
    const patient = await this.prismaService.prisma.user.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    return this.prismaService.prisma.appointment.findMany({
      where: { patientId },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    // Check if doctor profile exists
    const doctor = await this.prismaService.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    return this.prismaService.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    // Check if appointment exists
    await this.findOne(id);

    const updateData: any = { ...updateAppointmentDto };

    if (updateAppointmentDto.appointmentDate) {
      updateData.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    } else {
      delete updateData.appointmentDate;
    }

    return this.prismaService.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async cancel(id: string, cancellationReason?: string): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    return this.prismaService.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason,
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Check if appointment exists
    await this.findOne(id);

    await this.prismaService.prisma.appointment.delete({
      where: { id },
    });
  }
}
