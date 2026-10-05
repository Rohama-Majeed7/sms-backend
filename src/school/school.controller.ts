import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Get,
  UseGuards,
  Req,
  Query,
  ConflictException,
  Delete,
} from '@nestjs/common';
import { SchoolServices } from './school.service';
import { schoolDto } from './school.dto';
import { JwtAuthGuard } from 'src/guards/guards';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
@Controller('api/school')
export class SchoolController {
  constructor(private readonly schoolServices: SchoolServices) { }
  // Create school
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Create School',
    description: 'Create a new school. Only accessible by admin users.',
  })
  @ApiBody({
    type: schoolDto,
  })
  @ApiResponse({
    status: 201,
    description: 'School created successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  createSchool(
    @Body() body: schoolDto,
    @Req() req: { user: { role: string } },
  ) {
    const { role } = req.user;
    return this.schoolServices.createSchool(body, role);
  }
  // Update school
  @Patch('/:schoolId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Update School',
    description: 'Update the school details. Only accessible by admin users.',
  })
  @ApiBody({
    type: schoolDto,
  })
  @ApiResponse({
    status: 200,
    description: 'School updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  updateSchool(
    @Body() body: schoolDto,
    @Param('schoolId') schoolId: string,
    @Req() req: { user: { role: string } },
  ) {
    const { role } = req.user;
    return this.schoolServices.updateSchool(Number(schoolId), body, role);
  }
  // Get all schools
  @Get('/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get All Schools',
    description: 'Get all the schools. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Schools fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  getAllSchools(@Req() req: { user: { role: string } }) {
    const { role } = req.user;
    if (role !== 'STUDENT' && role !== 'TEACHER') {
      throw new ConflictException('You do not have access to view all schools');
    }
    return this.schoolServices.getAllSchools();
  }
  // Get school by id
  @Get('/:schoolId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get School By Id',
    description: 'Get the school details. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'School fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  getSchoolById(@Param('schoolId') schoolId: string) {
    return this.schoolServices.getSchoolById(Number(schoolId));
  }
  // Connect school to user
  @Post('connect/:schoolId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Connect School To User',
    description: 'Connect the school to the user. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'School connected successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  connectSchoolToUser(
    @Param('schoolId') schoolId: string,
    @Req() req: { user: { userId: number } },
  ) {
    return this.schoolServices.connectSchoolToUser(
      req.user.userId,
      Number(schoolId),
    );
  }
  // Get school teachers
  @Get('/:id/teachers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get School Teachers',
    description: 'Get the teachers of the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  getSchoolTeachers(
    @Param('id') schoolId: string,
    @Req() req: { user: { userId: number, role: string } },
    @Query('status') status: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to get school teachers');
    }
    return this.schoolServices.getSchoolTeachers(
      Number(schoolId),
      status,
      search,
      page,
      limit,
      req.user.userId,
    );
  }
  // Get school students
  @Get('/:id/students')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get School Students',
    description: 'Get the students of the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Students fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  getSchoolStudents(
    @Param('id') schoolId: string,
    @Req() req: { user: { userId: number, role: string } },
    @Query('status') status: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to get school students');
    }
    return this.schoolServices.getSchoolStudents(
      Number(schoolId),
      status,
      search,
      page,
      limit,
      req.user.userId,
    );
  }
  // Get school teacher by id
  @Get('/teachers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get School Teacher By Id',
    description: 'Get the teacher of the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  getSchoolTeacher(
    @Param('id') teacherId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.getSchoolTeacher(
      Number(teacherId),
      Number(schoolId),
    );
  }
  // Get school student by id
  @Get('/students/:id')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get School Student By Id',
    description: 'Get the student of the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  getSchoolStudent(
    @Param('id') studentId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.getSchoolStudent(
      Number(studentId),
      Number(schoolId),
    );
  }
  // Delete school student
  @Delete('/students/:studentId')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Delete School Student',
    description: 'Delete the student from the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  deleteSchoolStudent(
    @Param('studentId') studentId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.deleteSchoolStudent(
      Number(studentId),
      Number(schoolId),
    );
  }
  // Delete school teacher
  @Delete('/teachers/:teacherId')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Delete School Teacher',
    description: 'Delete the teacher from the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher deleted successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  deleteSchoolTeacher(
    @Param('teacherId') teacherId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.deleteSchoolTeacher(
      Number(teacherId),
      Number(schoolId),
    );
  }
  // Add teacher to school
  @Post('/teachers')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Add Teacher To School',
    description: 'Add the teacher to the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher added successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  addTeacherToSchool(
    @Body()
    body: {
      schoolId: number;
      name: string;
      email: string;
      role: string;
      employeeNumber: string;
      qualification: string;
      joiningDate: string;
      specialization: string;
    },
  ) {
    return this.schoolServices.addSchoolTeacher(body);
  }
  // Add student to school
  @Post('/students')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Add Student To School',
    description: 'Add the student to the school. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student added successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  addStudentToSchool(
    @Body()
    body: {
      schoolId: number;
      name: string;
      email: string;
      gender: Gender;
      dateOfBirth: string;
      address: string;
      guardianName: string;
      guardianPhone: string;
    },
  ) {
    return this.schoolServices.addSchoolStudent(body);
  }
}
