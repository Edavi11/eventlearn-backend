import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/roles/entities/role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
