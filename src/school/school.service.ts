import { Injectable } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AddStudentDto, AddTeacherDto, schoolDto } from './school.dto';
import * as crypto from 'crypto';
import { Gender } from '@prisma/client';
@Injectable()
export class SchoolServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) { }

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
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
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
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
    })
    if (existingUser?.schoolId) {
      throw new ConflictException('User already connected to a school');
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
  getSchoolTeachers = async (
    schoolId: number,
    status: string,
    search?: string,
    page?: string,
    limit?: string,
    adminId?: number,
  ) => {
    if (!schoolId) {
      throw new ConflictException('School ID is required');
    }
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
        adminId: adminId,
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }

    const where: Prisma.UserWhereInput = {
      schoolId,
      role: 'TEACHER',
    };

    // Status filter
    if (status === 'Active') {
      where.isVerified = true;
    }

    if (status === 'Inactive') {
      where.isVerified = false;
    }

    // Search filter
    if (search?.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [teachers, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);
    return {
      message: 'School teachers fetched successfully',
      data: teachers,
      success: true,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
      },
    };
  };
  getSchoolStudents = async (
    schoolId: number,
    status: string,
    search?: string,
    page?: string,
    limit?: string,
    adminId?: number,
  ) => {
    if (!schoolId) {
      throw new ConflictException('School ID is required');
    }
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
        adminId: adminId,
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }

    const where: Prisma.UserWhereInput = {
      schoolId,
      role: 'STUDENT',
    };

    // Status filter
    if (status === 'Active') {
      where.isVerified = true;
    }
    if (status === 'Inactive') {
      where.isVerified = false;
    }

    // Search filter
    if (search?.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [students, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,

        },
      }),
      this.prisma.user.count({
        where,
      }),
    ])
    return {
      message: 'School students fetched successfully',
      data: students,
      success: true,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
      },
    };
  };
  getSchoolStudent = async (studentId: number, schoolId: number) => {
    if (!schoolId) {
      throw new ConflictException('School ID is required');
    }
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    if (!existingSchool) {
      throw new ConflictException('School not found');
    }

    const isStudentInSchool = existingSchool.users.some(
      (user) => user.id === studentId,
    );

    if (!isStudentInSchool) {
      throw new ConflictException('Student is not in this school');
    }

    const existingStudent = await this.prisma.user.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        student: {
          select: {
            id: true,
            userId: true,
            dateOfBirth: true,
            gender: true,
            address: true,
            guardianName: true,
            guardianPhone: true,
          },
        },
      },
    });
    if (!existingStudent) {
      throw new ConflictException('Student not found');
    }
    return {
      message: 'School student fetched successfully',
      data: existingStudent,
      success: true,
    };
  };
  getSchoolTeacher = async (teacherId: number, schoolId: number) => {
    if (!schoolId) {
      throw new ConflictException('School ID is required');
    }
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }
    const isTeacherInSchool = existingSchool.users.some(
      (user) => user.id === teacherId,
    );
    if (!isTeacherInSchool) {
      throw new ConflictException('Teacher is not in this school');
    }
    const existingTeacher = await this.prisma.user.findUnique({
      where: {
        id: teacherId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        teacher: {
          select: {
            id: true,
            userId: true,
            employeeNumber: true,
            qualification: true,
            specialization: true,
            joiningDate: true,
          },
        },
      },
    });
    if (!existingTeacher) {
      throw new ConflictException('Teacher not found');
    }
    return {
      message: 'School teacher fetched successfully',
      data: existingTeacher,
      success: true,
    };
  };
  deleteSchoolTeacher = async (teacherId: number, schoolId: number) => {
    if (!schoolId) {
      throw new ConflictException('School ID is required');
    }
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }
    const isTeacherInSchool = existingSchool.users.some(
      (user) => user.id === teacherId,
    );
    if (!isTeacherInSchool) {
      throw new ConflictException('Teacher is not in this school');
    }
    const deletedTeacher = await this.prisma.user.delete({
      where: {
        id: teacherId,
      },
    });
    if (!deletedTeacher) {
      throw new ConflictException('Teacher not found');
    }
    return {
      message: 'School teacher deleted successfully',
      data: deletedTeacher,
      success: true,
    };
  };
  deleteSchoolStudent = async (studentId: number, schoolId: number) => {
    if (!schoolId) {
      throw new ConflictException('School ID is required');
    }
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      include: {
        users: {
          select: {
            id: true,

            name: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }
    const isStudentInSchool = existingSchool.users.some(
      (user) => user.id === studentId,
    );
    if (!isStudentInSchool) {
      throw new ConflictException('Student is not in this school');
    }
    const deletedStudent = await this.prisma.user.delete({
      where: {
        id: studentId,
      },
    });
    if (!deletedStudent) {
      throw new ConflictException('Student not found');
    }
    return {
      message: 'School student deleted successfully',
      data: deletedStudent,
      success: true,
    };
  };
  addSchoolTeacher = async (body: AddTeacherDto) => {
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: body.schoolId,
      },
    });
    if (!existingSchool) {
      throw new ConflictException('School not found');
    }

    const teacher = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: '', // You might want to hash this password or generate a random one
        role: 'TEACHER',
        schoolId: body.schoolId,
        isVerified: true,
        teacher: {
          create: {
            employeeNumber: body.employeeNumber,
            qualification: body.qualification,
            specialization: body.specialization,
            joiningDate: new Date(body.joiningDate),
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        teacher: {
          select: {
            id: true,
            employeeNumber: true,
            qualification: true,
            specialization: true,
            joiningDate: true,
          },
        },
      },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const passwordToken = await this.prisma.passwordToken.create({
      data: {
        userId: teacher.id,
        tokenHash,
        expiresAt: new Date(
          Date.now() + 2 * 60 * 1000,
        ),
      },
    });
    if (!passwordToken) {
      throw new ConflictException('Failed to create password token');
    }

    await this.mailService.sendPasswordResetEmail(teacher.email, rawToken);

    return {
      message: 'School teacher added successfully',
      data: teacher,
      success: true,
    };
  };
  addSchoolStudent = async (body: AddStudentDto) => {
    const existingSchool = await this.prisma.school.findUnique({
      where: {
        id: body.schoolId,
      }
    })
    if (!existingSchool) {
      throw new ConflictException('School not found')
    }
    const student = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: '',
        role: 'STUDENT',
        schoolId: body.schoolId,
        isVerified: true,
        student: {
          create: {
            dateOfBirth: new Date(body.dateOfBirth),
            gender: body.gender,
            address: body.address,
            guardianName: body.guardianName,
            guardianPhone: body.guardianPhone,
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        student: {
          select: {
            id: true,
            userId: true,
            dateOfBirth: true,
            gender: true,
            address: true,
            guardianName: true,
            guardianPhone: true,
          },
        },
      },
    })

    await this.prisma.student.update({
      where: {
        id: student?.student?.id
      },
      data: {
        userId: student.id
      }
    })

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const passwordToken = await this.prisma.passwordToken.create({
      data: {
        userId: student.id,
        tokenHash,
        expiresAt: new Date(
          Date.now() + 2 * 60 * 1000,
        ),
      },
    });
    if (!passwordToken) {
      throw new ConflictException('Failed to create password token');
    }
    console.log("token ========================>", passwordToken)
    await this.mailService.sendPasswordResetEmail(student.email, rawToken);

    return {
      message: 'School student added successfully',
      data: student,
      success: true,
    };

  }
}
