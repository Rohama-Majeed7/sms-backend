import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SectionService {
    constructor(private readonly prisma: PrismaService) { }

    async addStudentToSection(studentId: number, sectionId: number) {

        const student = await this.prisma.user.findUnique({
            where: { id: studentId }
        })
        if (!student) {
            throw new Error("Student not found")
        }
        if (student?.sectionId) {
            throw new ForbiddenException("Student is already in a section")
        }
        if (student.role !== "STUDENT") {
            throw new Error("User is not a student")
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: studentId },
            data: {
                sectionId: sectionId
            },
            select: {
                name: true,
                id: true,
                email: true,
                isVerified: true,
                sectionId: true,
            }

        })

        return {
            message: "Student added to section successfully",
            data: updatedUser,
            success: true,
        }

    }

    async removeStudentSection(studentId: number) {
        const student = await this.prisma.user.findUnique({
            where: {
                id: studentId
            }
        })
        if (!student) {
            throw new ForbiddenException("Student not found")
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: studentId
            },
            data: {
                sectionId: null
            },
            select: {
                name: true,
                id: true,
                email: true,
                isVerified: true,
                sectionId: true,
            }
        })
        return {
            message: "Student removed from section successfully",
            data: updatedUser,
            success: true,
        }
    }

}