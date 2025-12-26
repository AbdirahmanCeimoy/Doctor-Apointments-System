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
  NotFoundException,
} from '@nestjs/common';
import { DoctorProfileService } from './doctor-profile.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Controller('doctor-profiles')
export class DoctorProfileController {
  constructor(private readonly doctorProfileService: DoctorProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDoctorProfileDto: CreateDoctorProfileDto) {
    return this.doctorProfileService.create(createDoctorProfileDto);
  }

  @Get()
  findAll() {
    return this.doctorProfileService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.doctorProfileService.findByUserId(userId).then(profile => {
      if (!profile) {
        throw new NotFoundException(`Doctor profile not found for user ID ${userId}`);
      }
      return profile;
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorProfileService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorProfileDto: UpdateDoctorProfileDto,
  ) {
    return this.doctorProfileService.update(id, updateDoctorProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.doctorProfileService.remove(id);
  }
}

