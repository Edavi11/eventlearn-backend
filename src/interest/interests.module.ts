import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { InterestsService } from './interests.service';
import { InterestController } from './interests.controller';

import { Interest } from './entities/interest.entity';
import { StudentInterest } from './entities/student_interests.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Interest, StudentInterest])
  ],
  controllers: [InterestController],
  providers: [InterestsService],
  exports: [SequelizeModule, InterestsService]
})

export class InterestModule {}
