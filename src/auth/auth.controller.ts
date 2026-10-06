/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import type { Response, Request } from 'express';
import {
  LoginDto,
  SignupDto,
  SendOTPDto,
  VerifyOTPDto,
  ResetPasswordDto,
  SetPasswordDto,
  ResendSetPasswordTokenDto,
} from './dto/auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExcludeEndpoint,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/guards';
@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }
  // Register user
  @Post('signup')
  @ApiBearerAuth('accessToken')
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
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access.',
  })
  async registerUser(
    @Body()
    dto: SignupDto,
  ) {
    return this.authService.registerUser(
      dto.name,
      dto.email,
      dto.password,
      dto.role as Role,
    );
  }
  // Login user 
  @Post('login')
  @ApiBearerAuth('accessToken')
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
    return this.authService.loginUser(
      dto.email,
      dto.password,
      dto.portal,
      res,
    );
  }
  // Logout user 
  @Post('logout')
  @ApiBearerAuth('accessToken')
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
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutUser(body.email, res);
  }
  // Refresh token for user to get new access token
  @ApiExcludeEndpoint()
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.refreshToken(refreshToken, res);
  }
  // Send OTP for email verification for signup
  @Post('send-otp')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Send OTP',
    description:
      "Send a One-Time Password (OTP) to the user's email for verification.",
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
    return this.authService.sendOtp(dto.email);
  }
  // Verify OTP for reset password and email verification
  @Post('verify-otp')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Verify OTP',
    description: "Verify the One-Time Password (OTP) sent to the user's email.",
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
    return this.authService.verifyOtp(dto.email, dto.otp);
  }
  // Reset password when user forgot password
  @Post('reset-password')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Reset Password',
    description:
      "Reset the user's password using their email and a new password.",
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
    return this.authService.resetPassword(dto.email, dto.newPassword);
  }
  // Set password when user is created for the first time on admin - password setup link
  @Post('set-password')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Set Password',
    description: "Set the user's password using a password setup token and a new password.",
  })
  @ApiBody({
    type: SetPasswordDto,
  })
  @ApiOkResponse({
    description: 'Password set successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired password setup token.',
  })
  async setPassword(@Body() body: { token: string; password: string }) {
    return this.authService.setPassword(body.token, body.password);
  }
  // Resend link for password setup 
  @Post('resend-link')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Resend Password Setup Link',
    description: "Resend the password setup link to the user's email.",
  })
  @ApiBody({
    type: ResendSetPasswordTokenDto,
  })
  @ApiOkResponse({
    description: 'Password setup link resent successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired password setup token.',
  })
  async resendPasswordSetupLink(@Body() body: { token: string }) {
    return this.authService.resendPasswordSetupToken(body.token);
  }
} 
