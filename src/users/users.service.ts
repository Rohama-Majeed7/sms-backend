import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        schoolName: true,
        created: true,
      },
    });
  }
  getUserProfile(id: number) {
    console.log('User ID:', id); // Log the user ID to verify it's being passed correctly
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created: true,
      },
    });
  }
}
