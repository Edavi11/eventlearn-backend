import { InterestDto } from "src/interest/dto/interest-out.dto";
import { StudentProfile } from "../entities/student-profile.entity";

export class StudentProfileResponseDto {
  code: string;
  email: string;
  name: string;
  profile_picture_url: string | null;
  educational_level: string;
  learning_goals: string;
  num_events_subscribed: number;
  createdAt: Date;
  updatedAt: Date;
  interests: InterestDto[];

  constructor(profile: StudentProfile) {
    this.code = profile.user?.code;
    this.email = profile.user?.email;
    this.name = profile.user?.name;
    this.profile_picture_url = profile.profile_picture_url;
    this.educational_level = profile.educational_level;
    this.learning_goals = profile.learning_goals;
    this.num_events_subscribed = profile.num_events_subscribed;
    this.interests = InterestDto.fromEntities(profile.interests || []);
  }

  static fromEntity(profile: StudentProfile): StudentProfileResponseDto {
    return new StudentProfileResponseDto(profile);
  }
}
