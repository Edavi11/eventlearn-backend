import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { InterestsService } from './interests.service';
import { InterestController } from './interests.controller';

import { Interest } from './entities/interest.entity';
import { StudentInterest } from './entities/student_interests.entity';
import { InterestsRepository } from './repository/interests.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    SequelizeModule.forFeature([Interest, StudentInterest])
  ],
  controllers: [InterestController],
  providers: [InterestsService, InterestsRepository],
  exports: [SequelizeModule, InterestsService, InterestsRepository]
})

export class InterestModule {}
