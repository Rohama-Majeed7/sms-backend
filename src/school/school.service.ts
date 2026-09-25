import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { schoolDto } from './school.dto';
@Injectable()
export class SchoolServices {
  constructor(private readonly prisma: PrismaService) {}
  createSchool = async (body: schoolDto, role: string) => {
    if (role !== 'ADMIN') {
      throw new ConflictException('You do not have access to create school');
    }
    const {
      name,
      address,
      ownerName,
      ownerEmail,
      ownerPhone,
      status,
      adminId,
    } = body;
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        adminId: adminId,
      },
    });
    if (existingSchool) {
      throw new ConflictException('School already exists for this admin');
    }
    try {
      const school = await this.prisma.school.create({
        data: {
          name,
          address,
          ownerName,
          ownerEmail,
          ownerPhone,
          status,
          adminId,
        },
      });
      return {
        message: 'School created successfully',
        data: school,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error creating school',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
  updateSchool = async (schoolId: number, body: schoolDto, role: string) => {
    if (role !== 'ADMIN') {
      throw new ConflictException('You do not have access to update school');
    }
    const {
      name,
      address,
      ownerName,
      ownerEmail,
      ownerPhone,
      status,
      adminId,
    } = body;
    // console.log('schoolId:', typeof(schoolId));
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }
    try {
      const school = await this.prisma.school.update({
        where: {
          id: schoolId,
        },
        data: {
          name,
          address,
          ownerName,
          ownerEmail,
          ownerPhone,
          status,
          adminId,
        },
      });
      return {
        message: 'School updated successfully',
        data: school,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error updating school',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
  getSchoolById = async (schoolId: number) => {
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }
    return {
      message: 'School fetched successfully',
      data: existingSchool,
      success: true,
    };
  };
  getAllSchools = async () => {
    try {
      const schools = await this.prisma.school.findMany({
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          address: true,
          status: true,
        },
      });
      return {
        message: 'Schools fetched successfully',
        data: schools,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error fetching schools',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
  connectSchoolToUser = async (userId: number, schoolId: number) => {
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          schoolId: schoolId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          schoolId: true,

          school: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      });
      return {
        message: 'School connected to user successfully',
        data: user,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error connecting school to user',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
}
