import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolServices } from './school.service';
import { MailService } from 'src/services/mail.service';
@Module({
  controllers: [SchoolController],
  providers: [SchoolServices, MailService],
})
export class SchoolModule {}
