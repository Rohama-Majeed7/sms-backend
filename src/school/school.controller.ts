import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SchoolServices } from './school.service';
import { schoolDto } from './school.dto';
import { JwtAuthGuard } from 'src/guards/guards';
@Controller('api/school')
export class SchoolController {
  constructor(private readonly schoolServices: SchoolServices) {}
  @Post()
  createSchool(@Body() body: schoolDto) {
    return this.schoolServices.createSchool(body);
  }
  @Patch('/:schoolId')
  updateSchool(@Body() body: schoolDto, @Param('schoolId') schoolId: string) {
    return this.schoolServices.updateSchool(Number(schoolId), body);
  }
  @Get('/list')
  getAllSchools() {
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
}
