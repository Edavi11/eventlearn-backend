import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('execute')
  ExecuteSeed() {

    if (process.env.NODE_ENV === 'prod') {
      return { message: '🚫 No permitido en producción' };
    }

    return this.seedService.ExecuteSeed();
  }

}
