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
  UnauthorizedException,
} from '@nestjs/common';
import { SchoolServices } from './school.service';
import { AddStudentDto, AddTeacherDto, schoolDto } from './school.dto';
import { JwtAuthGuard } from 'src/guards/guards';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolServices: SchoolServices) { }
  // Create school
  @ApiTags("Admin - School")
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
    if (role !== "ADMIN") {
      throw new ConflictException('You do not have access to create school');
    }
    return this.schoolServices.createSchool(body, role);
  }
  // Update school
  @ApiTags("Admin - School")

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
    if (role !== "ADMIN") {
      throw new ConflictException('You do not have access to update school');
    }
    return this.schoolServices.updateSchool(Number(schoolId), body, role);
  }

  // Get school by id
  @ApiTags("Admin - School")

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
  getSchoolById(@Param('schoolId') schoolId: string, @Req() req: { user: { role: string } }) {
    const { role } = req.user;
    if (role !== "ADMIN") {
      throw new ConflictException('You do not have access to get school');
    }
    return this.schoolServices.getSchoolById(Number(schoolId));
  }

  // Get school teachers
  @ApiTags("Admin - School")

  @Get('/:schoolId/teachers')
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
    @Param('schoolId') schoolId: string,
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
  @ApiTags("Admin - School")

  @Get('/:schoolId/students')
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
    @Param('schoolId') schoolId: string,
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
  @ApiTags("Admin - School")

  @Get('/teachers/:teacherId')
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
    @Param('teacherId') teacherId: string,
    @Query('schoolId') schoolId: string,
    @Req() req: { user: { role: string } },
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to get school teacher');
    }
    return this.schoolServices.getSchoolTeacher(
      Number(teacherId),
      Number(schoolId),
    );
  }
  // Get school student by id
  @ApiTags("Admin - School")

  @Get('/students/:studentId')
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
    @Param('studentId') studentId: string,
    @Query('schoolId') schoolId: string,
    @Req() req: { user: { role: string } },
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to get school student');
    }
    return this.schoolServices.getSchoolStudent(
      Number(studentId),
      Number(schoolId),
    );
  }
  // Delete school student
  @ApiTags("Admin - School")

  @Delete('/students/:studentId')
  @UseGuards(JwtAuthGuard)
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
    @Req() req: { user: { role: string } },
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to delete school student');
    }
    return this.schoolServices.deleteSchoolStudent(
      Number(studentId),
      Number(schoolId),
    );
  }
  // Delete school teacher
  @ApiTags("Admin - School")

  @Delete('/teachers/:teacherId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Delete School Teacher',
    description: 'Delete the teacher from the school.',
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
    @Req() req: { user: { role: string } },
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to delete school teacher');
    }
    return this.schoolServices.deleteSchoolTeacher(
      Number(teacherId),
      Number(schoolId),
    );
  }
  // Add teacher to school
  @ApiTags("Admin - School")

  @Post('/teachers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Add Teacher To School',
    description: 'Add the teacher to the school.',
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
    body: AddTeacherDto,
    @Req() req: { user: { role: string } },
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to add teacher to school');
    }
    return this.schoolServices.addSchoolTeacher(body);
  }
  // Add student to school
  @ApiTags("Admin - School")

  @Post('/students')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Add Student To School',
    description: 'Add the student to the school.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Student added successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  addStudentToSchool(
    @Body()
    body: AddStudentDto,
    @Req() req: { user: { role: string } },
  ) {
    if (req?.user?.role !== "ADMIN") {
      throw new ConflictException('You do not have access to add student to school');
    }
    return this.schoolServices.addSchoolStudent(body);
  }
  @ApiTags("User - School Connection")
  // Connect school to user
  @Post('connect/:schoolId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Connect user to school',
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
    @Req() req: { user: { userId: number, role: string } },
  ) {
    if (req.user.role !== "TEACHER" && req.user.role !== "STUDENT") {
      throw new UnauthorizedException("You do not have access to perform this action.");
    }
    return this.schoolServices.connectSchoolToUser(
      req.user.userId,
      Number(schoolId),
    );
  }
  // Get all schools
  @ApiTags("User - Schools")
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

}
