/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from '@prisma/client';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) { }

  private async sendOtpCode(email: string, otp: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is ${otp}. This OTP will expire in 2 minutes. Please do not share it with anyone.`,
    });
  }

  private getAccessToken(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: 'access_token_secret',
    });
  }
  private getRefreshToken(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: 'refresh_token_secret',
    });
  }
  async registerUser(
    name: string,
    email: string,
    password: string,
    role: Role,
    
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException(
        'User with this email already exists in this school',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    return {
      message: 'User registered successfully',
      status: true,
      user: newUser,
    };
  }
  async loginUser(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('User is not verified');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const accessToken = this.getAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = this.getRefreshToken({
      id: user.id,
      email: user.email,
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      status: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
    };
  }

  async logoutUser(email: string, res: Response) {
    await this.prisma.user.update({
      where: { email },
      data: { refreshToken: '' },
    });
    res.clearCookie('refreshToken');
    return { message: 'Logout successful', status: true };
  }

  async refreshToken(refreshToken: string, res: Response) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: 'refresh_token_secret',
    });
    console.log(decoded);
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const accessToken = this.getAccessToken({
      id: user.id,
      email: user.email,
    });
    const newRefreshToken = this.getRefreshToken({
      id: user.id,
      email: user.email,
    });
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedNewRefreshToken },
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      message: 'Token refreshed successfully',
      status: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken: accessToken,
      },
    };
  }
  async sendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (!userExists) throw new UnauthorizedException('User not found');
    await this.sendOtpCode(email, otp);
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.prisma.otp.upsert({
      where: {
        email,
      },
      create: {
        email,
        hasdedCode: hashedOtp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      },
      update: {
        hasdedCode: hashedOtp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      },
    })
    return { message: 'OTP sent successfully', status: true };
  }
  async verifyOtp(email: string, otp: string) {
    const otpRecord = await this.prisma.otp.findUnique({
      where: { email },
    });
    if (!otpRecord) {
      throw new UnauthorizedException('No OTP found for this email');
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.hasdedCode);
    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP');
    }
    if (otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }
    await this.prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });
    await this.prisma.otp.deleteMany({
      where: { email },
    });
    return { message: 'OTP verified successfully', status: true };
  }
  async resetPassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return { message: 'Password reset successfully', status: true };
  }
}
