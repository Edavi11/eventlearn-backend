import { Interest } from '../entities/interest.entity';

export class InterestDto {
    code: string;
    name: string;
    description?: string;

    constructor(interest: Interest) {
        this.code = interest.code;
        this.name = interest.name;
        this.description = interest.description;
    }

    static fromEntity(interest: Interest): InterestDto {
        return new InterestDto(interest);
    }

    static fromEntities(interests: Interest[]): InterestDto[] {
        return interests.map((interest) => new InterestDto(interest));
    }

    toEntity(): Interest {
        const interest = new Interest();
        interest.name = this.name;
        interest.description = this.description;
        return interest;
    }
}
