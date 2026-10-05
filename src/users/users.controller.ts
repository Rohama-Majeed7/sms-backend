import { Controller, Get, Put, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/guards';
import { StudentProfileDto, TeacherProfileDto } from './user.dto';
import { ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

type AuthenticatedRequest = {
  user: {
    userId: string;
  };
};

@Controller('api/')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  // get student profile
  @Get('student/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get Student Profile',
    description: 'Get the profile of the student. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student profile fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })

  getStudentProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getStudentProfile(parseInt(req.user.userId, 10));
  }
  // get teacher profile
  @Get('teacher/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get Teacher Profile',
    description: 'Get the profile of the teacher. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher profile fetched successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  getTeacherProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getTeacherProfile(parseInt(req.user.userId, 10));
  }
  // update student profile
  @Put('student/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Update Student Profile',
    description: 'Update the profile of the student.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student profile updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiBody({
    type: StudentProfileDto,
  })
  updateStudentProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: StudentProfileDto,
  ) {
    return this.usersService.updateStudentProfile(
      parseInt(req.user.userId, 10),
      body,
    );
  }
  // update teacher profile
  @Put('teacher/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Update Teacher Profile',
    description: 'Update the profile of the teacher.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher profile updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiBody({
    type: TeacherProfileDto,
  })
  updateTeacherProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: TeacherProfileDto,
  ) {
    return this.usersService.updateTeacherProfile(
      parseInt(req.user.userId, 10),
      body,
    );
  }

}
