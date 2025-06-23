import { IsArray, IsObject, IsOptional, IsString } from "class-validator";

export class UpdateInstructorProfileDto {
  @IsOptional()
  @IsString()
  profile_picture_url?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialities?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  social_links?: { platform: string; url: string }[];

  @IsOptional()
  @IsString()
  teaching_experience?: string;
}
