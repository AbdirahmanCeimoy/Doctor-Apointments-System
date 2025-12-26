import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('patient/:patientId')
  findByPatientId(@Param('patientId') patientId: string) {
    return this.appointmentService.findByPatientId(patientId);
  }

  @Get('doctor/:doctorId')
  findByDoctorId(@Param('doctorId') doctorId: string) {
    return this.appointmentService.findByDoctorId(doctorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string, @Body('cancellationReason') cancellationReason?: string) {
    return this.appointmentService.cancel(id, cancellationReason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
