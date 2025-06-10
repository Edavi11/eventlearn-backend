import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/common/enums/user.role';
import { ApiResponse } from 'src/common/responses/responses';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestsService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  create(@Body() createInterestDto: CreateInterestDto): Promise<ApiResponse<any>> {
    return this.interestService.create(createInterestDto);
  }

  @Get('all')
  @Auth(UserRole.INSTRUCTOR, UserRole.STUDENT)
  findAll(): Promise<ApiResponse<any>> {
    return this.interestService.findAll();
  }

  @Get(':code')
  @Auth(UserRole.INSTRUCTOR, UserRole.STUDENT, )
  findOne(@Param('code') code: string): Promise<ApiResponse<any>> {
    return this.interestService.findOne(code);
  }

  @Put(':code')
  @Auth(UserRole.ADMIN)
  update(@Param('code') code: string, @Body() updateInterestDto: UpdateInterestDto): Promise<ApiResponse<any>> {
    return this.interestService.update(code, updateInterestDto);
  }

  @Delete(':code')
  @Auth(UserRole.ADMIN)
  remove(@Param('code') code: string): Promise<ApiResponse<any>> {
    return this.interestService.remove(code);
  }
}
