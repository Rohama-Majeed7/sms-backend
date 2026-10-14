import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ClassService } from "./class.service";
import { CreateClassDto, CreateTimeTableDto, UpdateClassDto, UpdateTimeTableDto } from "./class.dto";
import { ClassStatus } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("class")
@ApiTags("Admin - Classes")
@ApiBearerAuth()
export class ClassController {
    constructor(private readonly classService: ClassService) { }
    @Post("create")
    @ApiOperation({ summary: "Create a new class" })
    @ApiBody({ type: CreateClassDto })
    async createClass(@Body() body: CreateClassDto) {
        return this.classService.createClass(body);
    }
    @Get()
    @ApiOperation({ summary: "Get all classes" })
    @ApiQuery({ name: "schoolId", required: true, description: "School ID" })
    @ApiQuery({ name: "status", required: false, description: "Class status" })
    @ApiQuery({ name: "page", required: false, description: "Page number" })
    @ApiQuery({ name: "limit", required: false, description: "Limit" })
    @ApiQuery({ name: "search", required: false, description: "Search term" })
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
    @ApiOperation({ summary: "Get class by ID" })
    @ApiQuery({ name: "schoolId", required: true, description: "School ID" })
    @ApiParam({ name: "classId", required: true, description: "Class ID" })
    async getClassById(@Param("classId") classId: string, @Query("schoolId") schoolId: string) {
        return this.classService.getClassById(Number(classId), Number(schoolId));
    }
    @Patch("edit/:classId")
    @ApiOperation({ summary: "Update class" })
    @ApiParam({ name: "classId", required: true, description: "Class ID" })
    @ApiBody({ type: UpdateClassDto })
    async editClass(@Param("classId") classId: string, @Body() body: UpdateClassDto) {
        return this.classService.updateClass(Number(classId), body);
    }
    @Patch("publish/:classId")
    @ApiOperation({ summary: "Publish class" })
    @ApiParam({ name: "classId", required: true, description: "Class ID" })
    async publishClass(@Param("classId") classId: string) {
        return this.classService.publishClass(Number(classId));
    }
    @Delete("/:classId/section/:sectionId")
    @ApiOperation({ summary: "Delete class section" })
    @ApiParam({ name: "classId", required: true, description: "Class ID" })
    @ApiParam({ name: "sectionId", required: true, description: "Section ID" })
    async deleteClassSection(@Param("classId") classId: string, @Param("sectionId") sectionId: string) {
        return this.classService.deleteClassSection(Number(classId), Number(sectionId));
    }
    @Delete("/:classId/subject/:subjectId")
    @ApiOperation({ summary: "Delete class subject" })
    @ApiParam({ name: "classId", required: true, description: "Class ID" })
    @ApiParam({ name: "subjectId", required: true, description: "Subject ID" })
    async deleteClassSubject(@Param("classId") classId: string, @Param("subjectId") subjectId: string) {
        return this.classService.deleteClassSubject(Number(classId), Number(subjectId));
    }


    @Post("/sections/:sectionId/timetable")
    @ApiOperation({ summary: "Add timetable" })
    @ApiParam({ name: "sectionId", required: true, description: "Section ID" })
    @ApiBody({ type: CreateTimeTableDto })
    async addTimeTable(@Param("sectionId") sectionId: string, @Body() body: CreateTimeTableDto) {
        return this.classService.createTimetable(Number(sectionId), body);
    }

    @Get("sections/:sectionId/timetable")
    @ApiOperation({ summary: "Get section timetable" })
    @ApiParam({ name: "sectionId", required: true, description: "Section ID" })
    async getSectionTimetable(@Param("sectionId") sectionId: string) {
        return this.classService.getSectionTimetable(Number(sectionId));
    }

    @Patch("sections/timetable/:timetableId")
    @ApiOperation({ summary: "Update section timetable" })
    @ApiParam({ name: "timetableId", required: true, description: "Timetable ID" })
    @ApiBody({ type: UpdateTimeTableDto })
    async updateSectionTimetable(@Param("timetableId") timetableId: string, @Body() body: UpdateTimeTableDto) {
        return this.classService.updateSectionTimetable(Number(timetableId), body);
    }
    @Delete("sections/timetable/:timetableId")
    @ApiOperation({ summary: "Delete section timetable" })
    @ApiParam({ name: "timetableId", required: true, description: "Timetable ID" })
    async deleteSectionTimetable(@Param("timetableId") timetableId: string) {
        return this.classService.deleteSectionTimetable(Number(timetableId));
    }
}