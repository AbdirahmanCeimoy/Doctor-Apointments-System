import { Module } from '@nestjs/common';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TimeSlotController],
  providers: [TimeSlotService, PrismaService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}

