import {
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClassStatus, WeekDay } from '@prisma/client';
class CreateSectionDto {
    @IsInt()
    @Type(() => Number)
    @IsInt()
    @Type(() => Number)
    classId: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    inchargeId?: number;
}

class CreateSubjectDto {
    @IsInt()
    @Type(() => Number)
    classId: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Type(() => Number)
    schoolId: number;

    @IsEnum(ClassStatus)
    @IsOptional()
    status?: ClassStatus;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSectionDto)
    sections: CreateSectionDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSubjectDto)
    subjects: CreateSubjectDto[];
}


export class UpdateClassDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Type(() => Number)
    schoolId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSectionDto)
    sections: CreateSectionDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSubjectDto)
    subjects: CreateSubjectDto[];
}
export class TimeTableEntry {
    @IsInt()
    @Type(() => Number)
    sectionId: number;

    @IsInt()
    @Type(() => Number)
    subjectId: number;
    @IsInt()
    @Type(() => Number)
    teacherId: number;
    @IsString()
    @IsNotEmpty()
    day: WeekDay;
    @IsString()
    @IsNotEmpty()
    startTime: string;
    @IsString()
    @IsNotEmpty()
    endTime: string;
}
export class UpdateTimeTableDto extends TimeTableEntry {

}

export class CreateTimeTableDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TimeTableEntry)
    entries: TimeTableEntry[];
}