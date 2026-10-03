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
import { ApiOperation } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiBody, ApiResponse } from '@nestjs/swagger';
@Controller('api/school')
export class SchoolController {
  constructor(private readonly schoolServices: SchoolServices) { }
  @Post()
  @UseGuards(JwtAuthGuard)
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
  @Patch('/:schoolId')
  @UseGuards(JwtAuthGuard)
  updateSchool(
    @Body() body: schoolDto,
    @Param('schoolId') schoolId: string,
    @Req() req: { user: { role: string } },
  ) {
    const { role } = req.user;
    return this.schoolServices.updateSchool(Number(schoolId), body, role);
  }
  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getAllSchools(@Req() req: { user: { role: string } }) {
    const { role } = req.user;
    if (role !== 'STUDENT' && role !== 'TEACHER') {
      throw new ConflictException('You do not have access to view all schools');
    }
    return this.schoolServices.getAllSchools();
  }
  @Get('/:schoolId')
  getSchoolById(@Param('schoolId') schoolId: string) {
    return this.schoolServices.getSchoolById(Number(schoolId));
  }
  @Post('connect/:schoolId')
  @UseGuards(JwtAuthGuard)
  connectSchoolToUser(
    @Param('schoolId') schoolId: string,
    @Req() req: { user: { userId: number } },
  ) {
    return this.schoolServices.connectSchoolToUser(
      req.user.userId,
      Number(schoolId),
    );
  }
  @Get('/:id/teachers')
  @UseGuards(JwtAuthGuard)
  getSchoolTeachers(
    @Param('id') schoolId: string,
    @Req() req: { user: { userId: number } },
    @Query('status') status: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.schoolServices.getSchoolTeachers(
      Number(schoolId),
      status,
      search,
      page,
      limit,
      req.user.userId,
    );
  }
  @Get('/:id/students')
  @UseGuards(JwtAuthGuard)
  getSchoolStudents(
    @Param('id') schoolId: string,
    @Req() req: { user: { userId: number } },
    @Query('status') status: string,
    @Query('search') search?: string,
  ) {
    return this.schoolServices.getSchoolStudents(
      Number(schoolId),
      status,
      search,
      req.user.userId,
    );
  }
  @Get('/teachers/:id')
  getSchoolTeacher(
    @Param('id') teacherId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.getSchoolTeacher(
      Number(teacherId),
      Number(schoolId),
    );
  }
  @Get('/students/:id')
  getSchoolStudent(
    @Param('id') studentId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.getSchoolStudent(
      Number(studentId),
      Number(schoolId),
    );
  }
  @Delete('/students/:studentId')
  deleteSchoolStudent(
    @Param('studentId') studentId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.deleteSchoolStudent(
      Number(studentId),
      Number(schoolId),
    );
  }
  @Delete('/teachers/:teacherId')
  deleteSchoolTeacher(
    @Param('teacherId') teacherId: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.schoolServices.deleteSchoolTeacher(
      Number(teacherId),
      Number(schoolId),
    );
  }
  @Post('/teachers')
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
}
