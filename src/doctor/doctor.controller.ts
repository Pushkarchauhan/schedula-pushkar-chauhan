import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/user.entity';
import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // POST /doctor/profile — Create profile (onboarding)
  @Post('profile')
  async createProfile(@Request() req, @Body() dto: CreateDoctorProfileDto) {
    const profile = await this.doctorService.createProfile(req.user.id, dto);
    return {
      success: true,
      message: 'Doctor profile created successfully.',
      data: profile,
    };
  }

  // GET /doctor/profile — Get own profile
  @Get('profile')
  async getProfile(@Request() req) {
    const profile = await this.doctorService.getProfile(req.user.id);
    return {
      success: true,
      data: profile,
    };
  }

  // PATCH /doctor/profile — Update profile
  @Patch('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateDoctorProfileDto) {
    const profile = await this.doctorService.updateProfile(req.user.id, dto);
    return {
      success: true,
      message: 'Doctor profile updated successfully.',
      data: profile,
    };
  }
}
