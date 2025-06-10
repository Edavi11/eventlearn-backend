import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class CreateInstructorProfileDto {
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
    specialties?: string[];

    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    social_links?: { platform: string; url: string }[];

    @IsOptional()
    @IsString()
    teaching_experience?: string;
} 