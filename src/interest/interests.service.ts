// src/interests/interests.service.ts
import { Injectable, ConflictException } from '@nestjs/common'; // Añadimos ConflictException
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Interest } from './entities/interest.entity'; // Asegúrate que el nombre del archivo sea .entity.ts si así lo tienes
import { ApiException } from 'src/auth/exceptions/api.exception';
import { BadResponse } from 'src/common/responses/bad_response'; // Asegúrate de que estas rutas sean correctas
import { InterestsRepository } from './repository/interests.repository';

@Injectable()
export class InterestsService {

  constructor( private readonly interestsRepository: InterestsRepository ) {}

  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    const existingInterest = await this.interestsRepository.findByName(createInterestDto.name);
    if (existingInterest) {
      throw new ConflictException(BadResponse.INTEREST_ALREADY_EXISTS);
    }
    return this.interestsRepository.create(createInterestDto);
  }

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.findAll();
  }

  async findOne(id: number): Promise<Interest> {
    const interest = await this.interestsRepository.findById(id);
    if (!interest) {
      throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
    }
    return interest;
  }

  async update(id: number, updateInterestDto: UpdateInterestDto): Promise<Interest> {

    const interest = await this.interestsRepository.findById(id);

    if (!interest) {
      throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
    }

    if (updateInterestDto.name && updateInterestDto.name !== interest.name) {
      const existingInterest = await this.interestsRepository.findByName(updateInterestDto.name);
      if (existingInterest && existingInterest.id !== id) {
        throw new ApiException(BadResponse.INTEREST_ALREADY_EXISTS);
      }
    }

    const [numberOfAffectedRows, [updatedInterest]] = await this.interestsRepository.update(id, updateInterestDto);

    if (numberOfAffectedRows === 0) {
        throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
    }
    
    return updatedInterest;
  }

  async remove(id: number): Promise<void> { 
    const numberOfDeletedRows = await this.interestsRepository.delete(id);
    if (numberOfDeletedRows === 0) {
      throw new ApiException(BadResponse.INTEREST_NOT_FOUND);
    }
  }
}