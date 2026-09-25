import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Get,
  UseGuards,
  Req,
  ConflictException,
} from '@nestjs/common';
import { SchoolServices } from './school.service';
import { schoolDto } from './school.dto';
import { JwtAuthGuard } from 'src/guards/guards';
import { ApiOperation } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiBody, ApiResponse } from '@nestjs/swagger';
@Controller('api/school')
export class SchoolController {
  constructor(private readonly schoolServices: SchoolServices) {}
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
  @UseGuards(JwtAuthGuard)
  getSchoolById(
    @Param('schoolId') schoolId: string,
    @Req() req: { user: { role: string } },
  ) {
    const { role } = req.user;
    if (role !== 'ADMIN') {
      throw new ConflictException('You do not have access to view this school');
    }
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
}
