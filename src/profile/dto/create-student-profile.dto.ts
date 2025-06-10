import { IsEnum, IsOptional, IsString, IsArray, IsInt } from 'class-validator';
import { EducationalLevel } from 'src/common/enums/educational-level.enum';

export class CreateStudentProfileDto {

    @IsOptional()
    @IsString()
    profile_picture_url?: string;

    @IsOptional()
    @IsEnum(EducationalLevel)
    educational_level?: EducationalLevel;

    @IsOptional()
    @IsString()
    learning_goals?: string;

    @IsArray()
    @IsInt({ each: true })
    interests: number[];
}