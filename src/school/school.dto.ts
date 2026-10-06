import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, SchoolStatus } from '@prisma/client';

export class schoolDto {
  @ApiProperty({
    example: 'Greenwood High School',
  })
  @IsString()
  name!: string;
  @ApiProperty({
    example: '123@school.com',
  })
  @IsEmail()
  ownerEmail!: string;
  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  ownerPhone!: string;
  @ApiProperty({
    example: '123 Main St, Springfield, IL 62704',
  })
  @IsString()
  address!: string;
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  ownerName!: string;
  @ApiProperty({
    example: 'ACTIVE',
  })
  @IsString()
  status!: SchoolStatus;
  @ApiProperty({
    example: 1,
  })
  @IsString()
  adminId!: number;
}
export class AddTeacherDto {
  @ApiProperty({
    example: 1,
  })
  @IsString()
  schoolId!: number;
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name!: string;
  @ApiProperty({
    example: 'teacher@.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  employeeNumber!: string;
  @ApiProperty({
    example: 'B.Tech',
  })
  @IsString()
  qualification!: string;
  @ApiProperty({
    example: '2022-01-01',
  })
  @IsString()
  joiningDate!: string;
  @ApiProperty({
    example: 'Computer Science',
  })
  @IsString()
  specialization!: string;
}
export class AddStudentDto {
  @ApiProperty({
    example: 1,
  })
  @IsString()
  schoolId!: number;
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name!: string;
  @ApiProperty({
    example: 'student@.com',
  })
  @IsEmail()
  email!: string;
  @ApiProperty({
    example: 'MALE',
  })
  @IsString()
  gender!: Gender;
  @ApiProperty({
    example: '2022-01-01',
  })
  @IsString()
  dateOfBirth!: string;
  @ApiProperty({
    example: '123 Main St, Springfield, IL 62704',
  })
  @IsString()
  address!: string;
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  guardianName!: string;
  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  guardianPhone!: string;
}