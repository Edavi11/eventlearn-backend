import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { UserRole } from 'src/common/enums/user.role';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestService.create(createInterestDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.INSTRUCTOR)
  findAll() {
    return this.interestService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.INSTRUCTOR)
  findOne(@Param('id') id: number) {
    return this.interestService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() updateInterestDto: UpdateInterestDto) {
    return this.interestService.update(+id, updateInterestDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.interestService.remove(+id);
  }
}
