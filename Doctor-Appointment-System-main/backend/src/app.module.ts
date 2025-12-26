import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DoctorProfileModule } from './modules/doctor-profile/doctor-profile.module';
import { TimeSlotModule } from './modules/time-slot/time-slot.module';
import { AppointmentModule } from './modules/appointment/appointment.module';

@Module({
  imports: [
    UsersModule,
    DoctorProfileModule,
    TimeSlotModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
