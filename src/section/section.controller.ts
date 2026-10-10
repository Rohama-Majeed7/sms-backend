import { Body, Controller, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SectionService } from "./section.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("section")
@UseGuards(AuthGuard("jwt"))
export class SectionController {
    constructor(private readonly sectionService: SectionService) { }

    @Patch("add/student")
    async addStudentToSection(@Body() body: { sectionId: string, }, @Query("studentId") studentId: string) {
        return this.sectionService.addStudentToSection(Number(studentId), Number(body.sectionId))
    }

    @Patch("remove/student/:studentId")
    async removeStudentSection(@Param("studentId") studentId: string) {
        return this.sectionService.removeStudentSection(Number(studentId))
    }
}