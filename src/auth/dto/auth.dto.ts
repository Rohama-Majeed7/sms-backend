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
}