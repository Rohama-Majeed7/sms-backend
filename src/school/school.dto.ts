import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SchoolStatus } from '@prisma/client';

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
