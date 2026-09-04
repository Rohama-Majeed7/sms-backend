/* eslint-disable prettier/prettier */

import { IsString, IsEmail, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'romi@gmail.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'Password123',
    })
    @IsString()
    password!: string;
    @ApiProperty({
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    schoolId!: number;
}

export class SignupDto {
    @ApiProperty({
        example: 'John Doe',
    })
    @IsString()
    name!: string;
    @ApiProperty({
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email!: string;
    @ApiProperty({
        example: 'Password123',
    })
    @IsString()
    password!: string;
    @ApiProperty({
        example: 'USER',
    })
    @IsString()
    role!: string;
    @ApiProperty({
        example: 'A brief bio about the user.',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    schoolId?: number
    @ApiProperty({
        example: "Add schoolId of school"
    })
    @IsOptional()
    @IsString()
    schoolName?: string;
    @ApiProperty({
        example: 'JavaScript, TypeScript, Node.js',
    })

    @ApiProperty({
        example: 'false',
    })
    @IsBoolean()
    isVerified!: boolean;
}

export class SendOTPDto {
    @ApiProperty({
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email!: string;
    @ApiProperty({
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    schoolId?: number;
}
export class VerifyOTPDto {
    @ApiProperty({
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '123456',
    })
    @IsString()
    otp!: string;
    @ApiProperty({
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    schoolId?: number;
}

export class ResetPasswordDto {
    @ApiProperty({
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email!: string;
    @ApiProperty({
        example: 'NewPassword123',
    })
    @IsString()
    newPassword!: string;
    @ApiProperty({
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    schoolId?: number;

}