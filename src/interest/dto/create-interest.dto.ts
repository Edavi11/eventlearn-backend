import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateInterestDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;


  @IsOptional()
  @IsString()
  description?: string;
}