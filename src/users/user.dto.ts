import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsString, IsDateString } from 'class-validator';
export class TeacherProfileDto {
  @ApiProperty({
    example: 'EMP-0001',
  })
  @IsString()
  employeeNumber!: string;
  @ApiProperty({
    example: 'M.Sc. in Computer Science',
  })
  @IsString()
  qualification!: string;
  @ApiProperty({
    example: 'Computer Science',
  })
  @IsString()
  specialization!: string;
  @ApiProperty({
    example: '2020-08-15',
  })
  @IsDateString()
  joiningDate!: Date;
}
export class StudentProfileDto {
  @ApiProperty({
    example: '2020-08-15',
  })
  @IsDateString()
  dateOfBirth!: Date;
  @ApiProperty({
    example: '123 Main St, City, Country',
  })
  @IsString()
  address!: string;
  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  guardianPhone!: string;
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  guardianName!: string;
  @ApiProperty({
    example: 'Male',
  })
  @IsString()
  gender!: Gender;
}
