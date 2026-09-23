import { Controller, Get, Put, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/guards';
import { StudentProfileDto, TeacherProfileDto } from './user.dto';

type AuthenticatedRequest = {
  user: {
    userId: string;
  };
};

@Controller('api/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('student/profile')
  @UseGuards(JwtAuthGuard)
  getStudentProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getStudentProfile(parseInt(req.user.userId, 10));
  }

  @Get('teacher/profile')
  @UseGuards(JwtAuthGuard)
  getTeacherProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getTeacherProfile(parseInt(req.user.userId, 10));
  }

  @Put('student/profile')
  @UseGuards(JwtAuthGuard)
  updateStudentProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: StudentProfileDto,
  ) {
    return this.usersService.updateStudentProfile(
      parseInt(req.user.userId, 10),
      body,
    );
  }

  @Put('teacher/profile')
  @UseGuards(JwtAuthGuard)
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
