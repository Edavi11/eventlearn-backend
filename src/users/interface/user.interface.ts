import { User } from "../entities/user.model";

export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, userData: Partial<User>): Promise<[number, User[]]>;
  findByCode(code: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
