import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../entities/user.model';
import { Role } from '../../roles/entities/role.model';

import { IUserRepository } from '../interface/user.interface';

@Injectable()
export class UsersRepository implements IUserRepository {

  constructor( @InjectModel(User) private userModel: typeof User ) {}

  async create(userData: Partial<User>): Promise<User> {
    const newUser = await this.userModel.create(userData as User);
    return this.findById(newUser.id);
  }

  async findAll(): Promise<User[]> {
    throw await this.userModel.findAll({ include: [{ model: Role, as: 'roles' }] });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userModel.findByPk(id, {include: [{ model: Role, as: 'roles'}]})
  }

  async findByCode(code: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { code }, include: [{ model: Role, as: 'roles' }] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { email }, include: [{ model: Role, as: 'roles' }] });
  }

  async update(id: number, userData: Partial<User>): Promise<[number, User[]]> {
    const [affectedCount, affectedRows] = await this.userModel.update(userData, {
      where: { id },
      returning: true,
    });
    
    return [affectedCount, affectedRows];
  }
}
