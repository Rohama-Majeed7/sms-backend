import { Controller, Get, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/guards';
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getUserProfile(@Request() req: any) {
    const requestWithUser = req as { user?: { userId?: number } };
    return this.usersService.getUserProfile(
      requestWithUser.user?.userId as number,
    );
  }
}
