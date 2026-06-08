import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from './doctor-profile.entity';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepo: Repository<DoctorProfile>,
  ) {}

  // POST /doctor/profile
  async createProfile(userId: string, dto: CreateDoctorProfileDto): Promise<DoctorProfile> {
    // Prevent duplicate profile
    const existing = await this.doctorProfileRepo.findOne({ where: { userId } });
    if (existing) {
      throw new ConflictException(
        'Doctor profile already exists. Use PATCH /doctor/profile to update it.',
      );
    }

    const profile = this.doctorProfileRepo.create({ ...dto, userId });
    return this.doctorProfileRepo.save(profile);
  }

  // GET /doctor/profile
  async getProfile(userId: string): Promise<DoctorProfile> {
    const profile = await this.doctorProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(
        'Doctor profile not found. Please complete onboarding via POST /doctor/profile.',
      );
    }
    return profile;
  }

  // PATCH /doctor/profile
  async updateProfile(userId: string, dto: UpdateDoctorProfileDto): Promise<DoctorProfile> {
    const profile = await this.doctorProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(
        'Doctor profile not found. Please create it first via POST /doctor/profile.',
      );
    }

    Object.assign(profile, dto);
    return this.doctorProfileRepo.save(profile);
  }
}
