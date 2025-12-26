import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from '../../generated/prisma/client';
import { UserRole } from '../../generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Prevent creating PATIENT role through admin endpoint
    // Patients must use the signup endpoint
    if (createUserDto.role === UserRole.PATIENT) {
      throw new ConflictException('Patients cannot be created through this endpoint. Please use the signup endpoint.');
    }

    // Only allow ADMIN and DOCTOR roles to be created through this endpoint
    if (createUserDto.role !== UserRole.ADMIN && createUserDto.role !== UserRole.DOCTOR) {
      throw new ConflictException('Only admin and doctor roles can be created through this endpoint.');
    }

    // Check if user with email already exists
    const existingUser = await this.prismaService.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const userData = {
      ...createUserDto,
      dateOfBirth: createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : undefined,
    };

    return this.prismaService.prisma.user.create({
      data: userData,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.prisma.user.findMany({
      include: {
        doctorProfile: true,
        appointments: true,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prismaService.prisma.user.findUnique({
      where: { id },
      include: {
        doctorProfile: true,
        appointments: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        appointments: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    // If email is being updated, check if new email already exists
    if (updateUserDto.email) {
      const existingUser = await this.prismaService.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.dateOfBirth !== undefined) {
      updateData.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    } else {
      delete updateData.dateOfBirth;
    }

    return this.prismaService.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<void> {
    // Check if user exists
    await this.findOne(id);

    await this.prismaService.prisma.user.delete({
      where: { id },
    });
  }

  async login(loginDto: LoginDto): Promise<Omit<User, 'password'>> {
    // Find user by email without relations for login
    const user = await this.prismaService.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Note: In production, passwords should be hashed using bcrypt
    // For now, we're doing a simple comparison (assuming plain text storage)
    if (user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async signup(signupDto: SignupDto): Promise<Omit<User, 'password'>> {
    // Check if user with email already exists
    const existingUser = await this.prismaService.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const userData = {
      ...signupDto,
      role: UserRole.PATIENT, // Force PATIENT role for signup
      dateOfBirth: signupDto.dateOfBirth
        ? new Date(signupDto.dateOfBirth)
        : undefined,
    };

    const newUser = await this.prismaService.prisma.user.create({
      data: userData,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
