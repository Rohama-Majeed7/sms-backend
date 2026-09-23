import { Body, Controller, Post, Patch, Param, Get } from '@nestjs/common';
import { SchoolServices } from './school.service';
import { schoolDto } from './school.dto';
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
  connectSchoolToUser(
    @Param('schoolId') schoolId: string,
    @Body() body: { userId: number },
  ) {
    return this.schoolServices.connectSchoolToUser(
      body.userId,
      Number(schoolId),
    );
  }
}
