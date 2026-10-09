import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClassDto, CreateTimeTableDto, UpdateClassDto, UpdateTimeTableDto } from "./class.dto";

@Injectable()
export class ClassService {
    constructor(private readonly prisma: PrismaService) { }
    private timeToMinutes(time: string): number {
        const match = time.match(
            /^(0[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i,
        );

        if (!match) {
            throw new BadRequestException(
                `Invalid time "${time}". Use format like 09:00 AM`,
            );
        }

        let hour = Number(match[1]);
        const minute = Number(match[2]);
        const period = match[3].toUpperCase();

        if (period === 'AM' && hour === 12) {
            hour = 0;
        } else if (period === 'PM' && hour !== 12) {
            hour += 12;
        }

        return hour * 60 + minute;
    }

    private minutesToTimeString(minutes: number): string {
        const hours24 = Math.floor(minutes / 60);
        const mins = minutes % 60;

        const period = hours24 >= 12 ? 'PM' : 'AM';
        const hours12 = hours24 % 12 || 12;

        return `${String(hours12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
    }


    async createClass(body: CreateClassDto) {

        const existingClass = await this.prisma.class.findFirst({
            where: {
                name: body.name,
                schoolId: body.schoolId,
            }
        })
        if (existingClass) {
            throw new NotFoundException(`Class with name ${body.name} already exists`)
        }

        const createdClass = await this.prisma.class.create({
            data: {
                name: body.name,
                schoolId: body.schoolId,
                status: "DRAFT",
            },
        });

        if (body?.sections?.length > 0) {
            const sections = await Promise.all(body?.sections?.map(async (s) => {
                return await this.prisma.section.upsert({
                    where: {
                        section_class: {
                            name: s?.name,
                            classId: s?.classId,
                        }
                    },
                    create: {
                        name: s?.name,
                        classId: s?.classId,
                        inchargeId: s?.inchargeId,
                    },
                    update: {
                        name: s?.name,
                        classId: s?.classId,
                        inchargeId: s?.inchargeId,
                    }
                })
            }))

        }

        if (body?.subjects?.length > 0) {
            const subjects = await Promise.all(body?.subjects?.map(async (s) => {
                return await this.prisma.subject.upsert({
                    where: {
                        subject_class: {
                            name: s?.name,
                            classId: s?.classId,
                        }
                    },
                    create: {
                        name: s?.name,
                        classId: s?.classId,
                    },
                    update: {
                        name: s?.name,
                        classId: s?.classId,
                    }
                })
            }))
        }

        const finalClass = await this.prisma.class.findUnique({
            where: {
                id: createdClass.id
            },
            include: {
                sections: true,
                subjects: true
            }
        })
        return { message: "Class created successfully", data: finalClass, success: true }
    }
    async getClassById(id: number, schoolId: number) {
        const classes = await this.prisma.class.findUnique({
            where: {
                id: id,
                schoolId: schoolId
            },
            include: {
                sections: {
                    select: {
                        id: true,
                        name: true,
                        classId: true,
                        inchargeId: true,
                        incharge: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                    }
                },
                subjects: {
                    select: {
                        id: true,
                        name: true,
                        classId: true,
                    }
                }
            }
        })
        if (!classes) {
            throw new NotFoundException(`Class with id ${id} not found`)
        }

        return { message: "Class updated successfully", data: classes, success: true }
    }
    async getAllClasses(schoolId: number) {
        const classes = await this.prisma.class.findMany({
            where: {
                schoolId: schoolId
            },
            include: {
                sections: true,
                subjects: true
            }
        })
        return { message: "Classes fetched successfully", data: classes, success: true }
    }
    async updateClass(id: number, body: UpdateClassDto) {
        const classExist = await this.prisma.class.findUnique({
            where: {
                id,
            },
        });

        if (!classExist) {
            throw new BadRequestException('Class not found');
        }

        // Only check duplicate if name is actually provided
        if (body.name && body.name !== classExist.name) {
            const existingClass = await this.prisma.class.findFirst({
                where: {
                    name: body.name,
                    schoolId: classExist.schoolId,
                    NOT: {
                        id: classExist.id,
                    },
                },
            });

            if (existingClass) {
                throw new ConflictException(
                    `Class with ${body.name} already exists for same school`,
                );
            }
        }

        // Update class name
        if (body.name && body.name !== classExist.name) {
            await this.prisma.class.update({
                where: {
                    id: classExist.id,
                },
                data: {
                    name: body.name,
                },
            });
        }

        // Update / create sections
        if (body?.sections?.length > 0) {
            await Promise.all(
                body.sections.map((section) =>
                    this.prisma.section.upsert({
                        where: {
                            section_class: {
                                classId: classExist.id,
                                name: section.name,
                            },
                        },
                        create: {
                            name: section.name,
                            classId: classExist.id,
                            inchargeId: section.inchargeId ?? null,
                        },
                        update: {
                            name: section?.name,
                            inchargeId: section.inchargeId ?? null,
                        },
                    }),
                ),
            );
        }

        // Update / create subjects
        if (body?.subjects?.length > 0) {
            await Promise.all(
                body.subjects.map((subject) =>
                    this.prisma.subject.upsert({
                        where: {
                            subject_class: {
                                classId: classExist.id,
                                name: subject.name,
                            },
                        },
                        update: {
                            name: subject.name,
                            classId: classExist.id,
                        },
                        create: {
                            name: subject.name,
                            classId: classExist.id,
                        },

                    }),
                ),
            );
        }

        const finalClass = await this.prisma.class.findUnique({
            where: {
                id: classExist.id,
            },
            include: {
                sections: true,
                subjects: true,
            },
        });

        return {
            message: 'Class updated successfully',
            data: finalClass,
            success: true,
        };
    }
    async publishClass(classId: number) {
        const classes = await this.prisma.class.update({
            where: {
                id: classId
            },
            data: {
                status: "PUBLISHED"
            },
            include: {
                sections: {
                    select: {
                        id: true,
                        name: true,
                        classId: true,
                        inchargeId: true,
                        incharge: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                    }
                },
                subjects: {
                    select: {
                        id: true,
                        name: true,
                        classId: true,
                    }
                }
            }
        })
        if (!classes) {
            throw new NotFoundException(`Class with id ${classId} not found`)
        }
        if (classes.name === '') {
            throw new BadRequestException(`Class name is empty`)
        }
        if (classes.sections.length === 0) {
            throw new BadRequestException(`Class has no sections add at least one section`)
        }
        if (classes.subjects.length === 0) {
            throw new BadRequestException(`Class has no subjects add at least one subject`)
        }
        return { message: "Class published successfully", data: classes, success: true }
    }
    async deleteClassSection(classId: number, sectionId: number) {
        const section = await this.prisma.section.findUnique({
            where: {
                id: sectionId,
                classId: classId
            }
        })
        if (!section) {
            throw new NotFoundException(`Section not found`)
        }
        await this.prisma.section.delete({
            where: {
                id: sectionId
            }
        })
        return { message: "Section deleted successfully", success: true }
    }
    async deleteClassSubject(subjectId: number, classId: number) {
        const subject = await this.prisma.subject.findUnique({
            where: {
                id: subjectId,
                classId: classId
            }
        })
        if (!subject) {
            throw new NotFoundException(`Subject not found`)
        }
        await this.prisma.subject.delete({
            where: {
                id: subjectId
            }
        })
        return { message: "Subject deleted successfully", success: true }
    }

    async createTimetable(
        sectionId: number,
        body: CreateTimeTableDto,
    ) {
        if (!body.entries?.length) {
            throw new BadRequestException(
                'At least one timetable entry is required',
            );
        }

        // Find section
        const section = await this.prisma.section.findUnique({
            where: { id: sectionId },
        });

        if (!section) {
            throw new NotFoundException('Section not found');
        }

        // Convert and validate all incoming entries
        const entries = body.entries.map((entry) => {
            const startTime = this.timeToMinutes(entry.startTime);
            const endTime = this.timeToMinutes(entry.endTime);

            if (startTime >= endTime) {
                throw new BadRequestException(
                    `Start time must be earlier than end time: ${entry.startTime} - ${entry.endTime}`,
                );
            }

            return {
                ...entry,
                startTime,
                endTime,
            };
        });

        // Check conflicts within the incoming payload
        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                const a = entries[i];
                const b = entries[j];

                const overlaps =
                    a.day === b.day &&
                    a.startTime < b.endTime &&
                    a.endTime > b.startTime;

                if (overlaps) {
                    if (a.teacherId === b.teacherId) {
                        throw new ConflictException(
                            'Same teacher cannot teach overlapping periods',
                        );
                    }

                    throw new ConflictException(
                        'This section cannot have overlapping periods',
                    );
                }
            }
        }

        // Validate subjects and teachers
        for (const entry of entries) {
            const subject = await this.prisma.subject.findFirst({
                where: {
                    id: entry.subjectId,
                    classId: section.classId,
                },
            });

            if (!subject) {
                throw new BadRequestException(
                    `Subject ${entry.subjectId} does not belong to this class`,
                );
            }

            const teacher = await this.prisma.user.findUnique({
                where: { id: entry.teacherId },
            });

            if (!teacher) {
                throw new NotFoundException(
                    `Teacher/User ${entry.teacherId} not found`,
                );
            }

            // If your User model has a role field, also validate
            // here that this user is actually a teacher.
        }

        // Check existing schedule and create all entries atomically
        const timeTableData = await this.prisma.$transaction(async (tx) => {
            for (const entry of entries) {
                const conflict = await tx.timeTable.findFirst({
                    where: {
                        day: entry.day,
                        OR: [
                            { teacherId: entry.teacherId },
                            { sectionId },
                        ],
                        startTime: {
                            lt: entry.endTime,
                        },
                        endTime: {
                            gt: entry.startTime,
                        },
                    },
                });

                if (conflict) {
                    throw new ConflictException(
                        `Teacher or section already has a class on ${entry.day} during ${this.minutesToTimeString(entry.startTime)} - ${this.minutesToTimeString(entry.endTime)}`,
                    );
                }
            }

            return tx.timeTable.createMany({
                data: entries.map((entry) => ({
                    sectionId,
                    day: entry.day,
                    subjectId: entry.subjectId,
                    teacherId: entry.teacherId,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                })),
            });
        });

        return {
            message: "Time table created successfully",
            data: timeTableData,
            success: true
        }

    }

    async getSectionTimetable(sectionId: number) {
        const timetable = await this.prisma.timeTable.findMany({
            where: {
                sectionId: sectionId
            },
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                teacher: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                section: {
                    include: {
                        class: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        })
        return { message: "Timetable fetched successfully", data: timetable, success: true }
    }

    async deleteSectionTimeTable(timetableId: number) {
        const timetable = await this.prisma.timeTable.findUnique({
            where: {
                id: timetableId
            }
        })
        if (!timetable) {
            throw new NotFoundException(`Timetable not found`)
        }
        await this.prisma.timeTable.delete({
            where: {
                id: timetableId
            }
        })
        return { message: "Timetable period deleted successfully", success: true }
    }

    async updateSectionTimetable(timetableId: number, body: UpdateTimeTableDto) {
        const startTime = this.timeToMinutes(body.startTime)
        const endTime = this.timeToMinutes(body.endTime)
        if (startTime >= endTime) {
            throw new BadRequestException(`Start time must be less than end time`)
        }
        const timetable = await this.prisma.timeTable.findUnique({
            where: {
                id: timetableId
            }
        })
        if (!timetable) {
            throw new NotFoundException(`Timetable not found`)
        }
        await this.prisma.timeTable.update({
            where: {
                id: timetableId
            },
            data: {
                day: body.day,
                subjectId: body.subjectId,
                teacherId: body.teacherId,
                startTime: startTime,
                endTime: endTime,
            }
        })
        return { message: "Timetable updated successfully", success: true }
    }

    async deleteSectionTimetable(timetableId: number) {
        const timetable = await this.prisma.timeTable.findUnique({
            where: {
                id: timetableId
            }
        })
        if (!timetable) {
            throw new NotFoundException(`Timetable not found`)
        }
        await this.prisma.timeTable.delete({
            where: {
                id: timetableId
            }
        })
        return { message: "Timetable period deleted successfully", success: true }
    }

}