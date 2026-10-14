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
              role: true,
              sectionId: true,
              sectionStudent: {
                select: {
                  name: true,
                  id: true,
                  inchargeId: true,
                  timeTable: {
                    select: {
                      id: true,
                      day: true,
                      startTime: true,
                      endTime: true,
                      teacherId: true,
                      subjectId: true,
                      teacher: {
                        select: {
                          name: true,
                          id: true
                        }
                      },
                      subject: {
                        select: {
                          id: true,
                          name: true
                        }
                      }
                    }
                  },
                  incharge: {
                    select: {
                      name: true,
                      id: true
                    }
                  },
                  class: {
                    select: {
                      id: true,
                      name: true,
                      subjects: {
                        select: {
                          id: true,
                          name: true
                        }
                      }
                    }
                  }
                }
              }
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
      const teacherProfile = await this.prisma.teacher.findUnique({
        where: { userId },
        select: {
          id: true,
          employeeNumber: true,
          qualification: true,
          specialization: true,
          joiningDate: true,
          userId: true,

        }
      });
      if (!teacherProfile) {
        throw new Error('Teacher not found');
      }
      const teacher = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          name: true,
          email: true,
          isVerified: true,
          role: true,
          sectionIncharge: {
            select: {
              name: true,
              id: true,
              inchargeId: true,
              students: {
                select: {
                  name: true,
                  id: true
                }
              },
              incharge: {
                select: {
                  name: true,
                  id: true
                }
              },
              class: {
                select: {
                  id: true,
                  name: true,
                  subjects: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      })
      if (!teacher) {
        throw new Error('Teacher not found')
      }

      const timeTable = await this.prisma.timeTable.findMany({
        where: {
          teacherId: Number(teacher.id)
        },
        select: {
          id: true,
          day: true,
          startTime: true,
          endTime: true,
          teacherId: true,
          subjectId: true,
          sectionId: true,
          section: {
            select: {
              name: true,
              id: true,
              students: {
                select: {
                  id: true,
                  name: true
                }
              },
              class: {
                select: {
                  name: true,
                  id: true,
                  subjects: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          },
          teacher: {
            select: {
              name: true,
              id: true
            }
          },
          subject: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })


      return {
        message: 'Teacher profile fetched successfully',
        data: {
          ...teacherProfile,
          ...teacher,
          timeTable: timeTable
        },
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
