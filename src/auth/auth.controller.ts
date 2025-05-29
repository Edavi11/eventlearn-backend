import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

}
