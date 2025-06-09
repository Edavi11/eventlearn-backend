import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/common/enums/user.role';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestsService) {}

  @Post('create/new/interest')
  @Auth(UserRole.ADMIN)
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestService.create(createInterestDto);
  }

  @Get('all')
  findAll() {
    return this.interestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.interestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateInterestDto: UpdateInterestDto) {
    return this.interestService.update(+id, updateInterestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.interestService.remove(+id);
  }
}
