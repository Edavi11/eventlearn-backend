export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: number | string): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: number | string, data: Partial<T>): Promise<[number, T[]]>;
    delete(id: number | string): Promise<number>;
}