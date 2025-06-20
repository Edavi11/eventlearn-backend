import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Interest } from '../entities/interest.entity';
import { CreateInterestDto } from '../dto/create-interest.dto';
import { UpdateInterestDto } from '../dto/update-interest.dto';

@Injectable()
export class InterestsRepository {

  constructor(@InjectModel(Interest) private readonly interestModel: typeof Interest) { }

  async create(data: CreateInterestDto): Promise<Interest> {
    return this.interestModel.create(data);
  }

  async findAll(): Promise<Interest[]> {
    return this.interestModel.findAll();
  }

  async findById(id: number): Promise<Interest | null> {
    return this.interestModel.findByPk(id);
  }

  async findByCode(code: string): Promise<Interest | null> {
    return this.interestModel.findOne({
      where: { code }
    });
  }

  async findAllByCodes(codes: string[]): Promise<Interest[]> {
    return this.interestModel.findAll({
      where: {
        code: codes,
      },
    });
  }
  
  async update(code: string, data: UpdateInterestDto): Promise<[number, Interest[]]> {
    return this.interestModel.update(data, {
      where: { code },
      returning: true,
    });
  }

  async delete(code: string): Promise<number> {
    return this.interestModel.destroy({
      where: { code: code },
    });
  }

  async findByName(name: string): Promise<Interest | null> {
    return this.interestModel.findOne({ where: { name } });
  }
}