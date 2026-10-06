import { Controller, Get, Put, Req, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/guards';
import { StudentProfileDto, TeacherProfileDto } from './user.dto';
import { ApiOperation, ApiResponse, ApiBadRequestResponse, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = {
  user: {
    userId: string;
    role: string;
  };
};
@ApiTags("User - Profile")
@Controller('')
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
    if (req.user.role !== 'STUDENT') {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.usersService.getStudentProfile(parseInt(req.user.userId));
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
    if (req.user.role !== 'TEACHER') {
      throw new UnauthorizedException('Unauthorized');
    }
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
    if (req.user.role !== 'STUDENT') {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.usersService.updateStudentProfile(
      parseInt(req.user.userId),
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
    if (req.user.role !== 'TEACHER') {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.usersService.updateTeacherProfile(
      parseInt(req.user.userId),
      body,
    );
  }

}
