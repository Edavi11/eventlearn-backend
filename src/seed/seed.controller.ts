import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/common/enums/user.role';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('execute')
  @Auth(UserRole.ADMIN)
  ExecuteSeed() {

    if (process.env.NODE_ENV === 'prod') {
      return { message: '🚫 No permitido en producción' };
    }

    return this.seedService.ExecuteSeed();
  }

}
