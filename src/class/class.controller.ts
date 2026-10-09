import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ClassService } from "./class.service";
import { CreateClassDto, CreateTimeTableDto, UpdateClassDto, UpdateTimeTableDto } from "./class.dto";
import { ClassStatus } from "@prisma/client";

@Controller("class")
export class ClassController {
    constructor(private readonly classService: ClassService) { }
    @Post("create")
    async createClass(@Body() body: CreateClassDto) {
        return this.classService.createClass(body);
    }
    @Get()
    async getAllClasses(
        @Query("schoolId") schoolId: string,
        @Query("status") status?: ClassStatus,
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("search") search?: string,
    ) {
        return this.classService.getAllClasses(Number(schoolId), Number(page), Number(limit), search, status);
    }
    @Get("/:classId")
    async getClassById(@Param("classId") classId: string, @Query("schoolId") schoolId: string) {
        return this.classService.getClassById(Number(classId), Number(schoolId));
    }
    @Patch("edit/:classId")
    async editClass(@Param("classId") classId: string, @Body() body: UpdateClassDto) {
        return this.classService.updateClass(Number(classId), body);
    }
    @Patch("publish/:classId")
    async publishClass(@Param("classId") classId: string) {
        return this.classService.publishClass(Number(classId));
    }
    @Delete("/:classId/section/:sectionId")
    async deleteClassSection(@Param("classId") classId: string, @Param("sectionId") sectionId: string) {
        return this.classService.deleteClassSection(Number(classId), Number(sectionId));
    }
    @Delete("/:classId/subject/:subjectId")
    async deleteClassSubject(@Param("classId") classId: string, @Param("subjectId") subjectId: string) {
        return this.classService.deleteClassSubject(Number(classId), Number(subjectId));
    }


    @Post("/sections/:sectionId/timetable")
    async addTimeTable(@Param("sectionId") sectionId: string, @Body() body: CreateTimeTableDto) {
        return this.classService.createTimetable(Number(sectionId), body);
    }

    @Get("sections/:sectionId/timetable")
    async getSectionTimetable(@Param("sectionId") sectionId: string) {
        return this.classService.getSectionTimetable(Number(sectionId));
    }

    @Patch("sections/timetable/:timetableId")
    async updateSectionTimetable(@Param("timetableId") timetableId: string, @Body() body: UpdateTimeTableDto) {
        return this.classService.updateSectionTimetable(Number(timetableId), body);
    }
    @Delete("sections/timetable/:timetableId")
    async deleteSectionTimetable(@Param("timetableId") timetableId: string) {
        return this.classService.deleteSectionTimetable(Number(timetableId));
    }
}