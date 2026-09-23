import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolServices } from './school.service';
@Module({
  controllers: [SchoolController],
  providers: [SchoolServices],
})
export class SchoolModule {}
