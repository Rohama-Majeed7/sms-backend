import { Body, Controller, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SectionService } from "./section.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("section")
@ApiTags("Admin - Sections")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
export class SectionController {
    constructor(private readonly sectionService: SectionService) { }

    @Patch("add/student")
    @ApiOperation({ summary: "Add student to section" })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                sectionId: {
                    type: 'number',
                    example: 1,
                },
            },
            required: ['sectionId'],
        },
    })
    @ApiQuery({ name: "studentId", required: true, description: "Student ID" })
    async addStudentToSection(@Body() body: { sectionId: number, }, @Query("studentId") studentId: string) {
        return this.sectionService.addStudentToSection(Number(studentId), Number(body.sectionId))
    }

    @Patch("remove/student/:studentId")
    @ApiOperation({ summary: "Remove student from section" })
    @ApiParam({ name: "studentId", required: true, description: "Student ID" })
    async removeStudentSection(@Param("studentId") studentId: string) {
        return this.sectionService.removeStudentSection(Number(studentId))
    }
}