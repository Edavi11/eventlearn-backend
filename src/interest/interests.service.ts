import { Injectable, ConflictException, Logger } from '@nestjs/common'; 
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { ApiException } from 'src/auth/exceptions/api.exception';
import { BadResponse } from 'src/common/responses/bad_response'; 
import { InterestsRepository } from './repository/interests.repository';
import { InterestDto } from './dto/interest-out.dto';
import { GoodResponse } from 'src/common/responses/good_response';
import { ApiResponse } from 'src/common/responses/responses';
import { ResponseModule } from 'src/common/enums/response_module.enum';

@Injectable()
export class InterestsService {

  private readonly logger = new Logger(InterestsService.name);

  constructor(private readonly interestsRepository: InterestsRepository) { }

  async create(createInterestDto: CreateInterestDto): Promise<ApiResponse> {

    try {
      const existingInterest = await this.interestsRepository.findByName(createInterestDto.name);
      if (existingInterest) {
        throw new ApiException(BadResponse.INTEREST_ALREADY_EXISTS);
      }

      const interest = await this.interestsRepository.create(createInterestDto)

      const data = InterestDto.fromEntity(interest);
      const response = GoodResponse.SUCCESSFUL_GET(data, ResponseModule.INTEREST);

      return response;

    } catch (error) {
      this.logger.error('Error during user creating an interest');
      if (error instanceof ApiException) {
        throw error;
      }

      return BadResponse.UNEXPECTED_ERROR(ResponseModule.INTEREST)
    }
  }

  async findAll(): Promise<ApiResponse> {

    try {
      const interests = await this.interestsRepository.findAll();
      const data = InterestDto.fromEntities(interests);

      const response = GoodResponse.SUCCESSFUL_GET(data, ResponseModule.INTEREST);
      return response;

    } catch (error) {
      this.logger.error('Error during user find all interest');
      if (error instanceof ApiException) {
        throw error;
      }

      return BadResponse.UNEXPECTED_ERROR(ResponseModule.INTEREST)
    }
  }

  async findOne(code: string): Promise<ApiResponse> {

    try {
      const interest = await this.interestsRepository.findByCode(code);
      if (!interest) {
        throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
      }

      const data = InterestDto.fromEntity(interest);
      const response = GoodResponse.SUCCESSFUL_GET(data, ResponseModule.INTEREST);

      return response;


    } catch (error) {

      this.logger.error('Error during user find one by code interest');
      if (error instanceof ApiException) {
        throw error;
      }

      return BadResponse.UNEXPECTED_ERROR(ResponseModule.INTEREST)

    }
  }

  async update(code: string, updateInterestDto: UpdateInterestDto): Promise<ApiResponse> {

    try {
      const interest = await this.interestsRepository.findByCode(code);

      if (!interest) {
        throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
      }

      if (updateInterestDto.name && updateInterestDto.name !== interest.name) {
        const existingInterest = await this.interestsRepository.findByName(updateInterestDto.name);
        if (existingInterest && existingInterest.code !== code) {
          throw new ApiException(BadResponse.INTEREST_ALREADY_EXISTS);
        }
      }

      const [numberOfAffectedRows, [updatedInterest]] = await this.interestsRepository.update(code, updateInterestDto);

      if (numberOfAffectedRows === 0) {
        throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
      }

      return GoodResponse.SUCCESSFUL_UPDATE(ResponseModule.INTEREST);

    } catch (error) {

      this.logger.error('Error during user updating interest');
      if (error instanceof ApiException) {
        throw error;
      }

      return BadResponse.UNEXPECTED_ERROR(ResponseModule.INTEREST)
    }
  }

  async remove(code: string): Promise<ApiResponse<any>> {

    try {
      const numberOfDeletedRows = await this.interestsRepository.delete(code);
      if (numberOfDeletedRows === 0) {
        throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
      }
      return GoodResponse.SUCCESSFUL_DELETION(ResponseModule.INTEREST);

    } catch (error) {

      this.logger.error('Error during user deleting interest');
      if (error instanceof ApiException) {
        throw error;
      }

      return BadResponse.UNEXPECTED_ERROR(ResponseModule.INTEREST);
    }
  }
}