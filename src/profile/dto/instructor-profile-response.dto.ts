import { InstructorProfile } from "../entities/instructor-profile.entity";

export class InstructorProfileResponseDto {
  code: string;
  email: string;
  name: string;
  profile_picture_url: string | null;
  title: string;
  bio: string;
  specialties: string[];
  social_links: { platform: string; url: string }[];
  teaching_experience: string;
  average_rating: number;
  num_events: number;
  num_subscribers: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(profile: InstructorProfile) {
    this.code = profile.user?.code;
    this.email = profile.user?.email;
    this.name = profile.user?.name;
    this.profile_picture_url = profile.profile_picture_url;
    this.title = profile.title;
    this.bio = profile.bio;
    this.specialties = profile.specialties || [];
    this.social_links = profile.social_links || [];
    this.teaching_experience = profile.teaching_experience;
    this.average_rating = parseFloat(profile.average_rating?.toString() || '0');
    this.num_events = profile.num_events;
    this.num_subscribers = profile.num_subscribers;
  }

  static fromEntity(profile: InstructorProfile): InstructorProfileResponseDto {
    return new InstructorProfileResponseDto(profile);
  }
}
