// src/interests/interests.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Interest } from '../entities/interest.entity';
import { CreateInterestDto } from '../dto/create-interest.dto';
import { UpdateInterestDto } from '../dto/update-interest.dto';

@Injectable()
export class InterestsRepository {

  constructor( @InjectModel(Interest) private readonly interestModel: typeof Interest ) {}

  async create(data: CreateInterestDto): Promise<Interest> {
    return this.interestModel.create(data);
  }

  async findAll(): Promise<Interest[]> {
    return this.interestModel.findAll();
  }

  async findById(id: number): Promise<Interest | null> {
    return this.interestModel.findByPk(id);
  }

  async update(id: number, data: UpdateInterestDto): Promise<[number, Interest[]]> { 
    return this.interestModel.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return this.interestModel.destroy({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Interest | null> {
    return this.interestModel.findOne({ where: { name } });
  }
}