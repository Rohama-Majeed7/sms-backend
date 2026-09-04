/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import type { Response, Request } from 'express';
import { LoginDto, SignupDto, SendOTPDto, VerifyOTPDto, ResetPasswordDto } from './dto/auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExcludeEndpoint
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/guards';


@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({
    summary: 'Register User',
    description: 'Create a new user account.',
  })
  @ApiBody({
    type: SignupDto,
  })
  @ApiOkResponse({
    description: 'User registered successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  async registerUser(
    @Body()
    dto: SignupDto
  ) {
    return this.authService.registerUser(
      dto.name,
      dto.email,
      dto.password,
      dto.role as Role,
      dto.schoolId,
      dto.schoolName
    );
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login User',
    description: 'Authenticate user using email and password.',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    description: 'Login successful.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password.',
  })

  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginUser(dto.email, dto.password, dto.schoolId, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)

  @ApiOperation({
    summary: 'Logout User',
    description: 'Logout the authenticated user and clear the refresh token.',
  })
  @ApiOkResponse({
    description: 'Logout successful.',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated.',
  })

  async logoutUser(
    @Body() body: { email: string; schoolId?: number },
    @Res({ passthrough: true }) res: Response,
  ) {

    return this.authService.logoutUser(body.email, body.schoolId, res);
  }
  @ApiExcludeEndpoint()
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.refreshToken(refreshToken, res);
  }
  @Post('send-otp')
  @ApiOperation({
    summary: 'Send OTP',
    description: 'Send a One-Time Password (OTP) to the user\'s email for verification.',
  })
  @ApiBody({
    type: SendOTPDto,
  })
  @ApiOkResponse({
    description: 'OTP sent successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiUnauthorizedResponse({
    description: 'User not found or not verified.',
  })
  async sendOtp(@Body() dto: SendOTPDto) {
    return this.authService.sendOtp(dto.email, dto.schoolId);
  }
  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verify the One-Time Password (OTP) sent to the user\'s email.',
  })
  @ApiBody({
    type: VerifyOTPDto,
  })
  @ApiOkResponse({
    description: 'OTP verified successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired OTP.',
  })
  async verifyOtp(@Body() dto: VerifyOTPDto) {
    return this.authService.verifyOtp(dto.email, dto.otp, dto.schoolId);
  }
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset the user\'s password using their email and a new password.',
  })
  @ApiBody({
    type: ResetPasswordDto,
  })
  @ApiOkResponse({
    description: 'Password reset successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiUnauthorizedResponse({
    description: 'User not found or not verified.',
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.newPassword, dto.schoolId);
  }
}
