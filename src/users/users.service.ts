import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentProfileDto, TeacherProfileDto } from './user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }
  getStudentProfile = async (userId: number) => {
    try {
      const student = await this.prisma.student.findUnique({
        where: { userId },
        select: {
          id: true,
          dateOfBirth: true,
          address: true,
          guardianPhone: true,
          guardianName: true,
          gender: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isVerified: true,
              role: true
            }
          }
        }
      });
      if (!student) {
        throw new Error('Student not found');
      }
      return {
        message: 'Student profile fetched successfully',
        data: student,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error fetching student profile',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
  getTeacherProfile = async (userId: number) => {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
        select: {
          id: true,
          employeeNumber: true,
          qualification: true,
          specialization: true,
          joiningDate: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isVerified: true,
              role: true
            }
          }
        }
      });
      if (!teacher) {
        throw new Error('Teacher not found');
      }
      return {
        message: 'Teacher profile fetched successfully',
        data: teacher,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error fetching teacher profile',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
  updateTeacherProfile = async (userId: number, body: TeacherProfileDto) => {
    try {
      const teacher = await this.prisma.teacher.upsert({
        where: { userId },
        update: {
          employeeNumber: body.employeeNumber,
          qualification: body.qualification,
          specialization: body.specialization,
          joiningDate: new Date(body.joiningDate),
        },
        create: {
          employeeNumber: body.employeeNumber,
          qualification: body.qualification,
          specialization: body.specialization,
          joiningDate: new Date(body.joiningDate),
          userId,
        },
      });
      return {
        message: 'Teacher profile updated successfully',
        data: teacher,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error updating teacher profile',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
  updateStudentProfile = async (userId: number, body: StudentProfileDto) => {
    try {
      const student = await this.prisma.student.upsert({
        where: { userId },
        update: {
          dateOfBirth: new Date(body.dateOfBirth),
          address: body.address,
          guardianPhone: body.guardianPhone,
          guardianName: body.guardianName,
          gender: body.gender,
        },
        create: {
          dateOfBirth: new Date(body.dateOfBirth),
          address: body.address,
          guardianPhone: body.guardianPhone,
          guardianName: body.guardianName,
          gender: body.gender,
          userId,
        },
      });
      return {
        message: 'Student profile updated successfully',
        data: student,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error updating student profile',
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  };
}
