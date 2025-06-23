import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { EducationalLevel } from "src/common/enums/educational-level.enum";

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  profile_picture_url?: string;

  @IsOptional()
  @IsEnum(EducationalLevel)
  education_level?: EducationalLevel;

  @IsOptional()
  @IsString()
  learning_goals?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}