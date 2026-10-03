import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendOtp(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is ${otp}. This OTP will expire in 2 minutes. Please do not share it with anyone.`,
    });
  }
  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.sms_user_portal_url}/set-password?token=${token}`;
    const mailOptions = {
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    };
    await this.mailerService.sendMail(mailOptions);
  };
}
