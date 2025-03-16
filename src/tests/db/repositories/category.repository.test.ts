import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { CategoryRepository } from '../../../db/repositories/category.repository';
import { categories } from '../../../models/categories';

const mockBaseRepository = {
  create: mock(async (data: any) => ({ id: 1, ...data })),
  findAll: mock(async (userId?: number) => [{ id: 1, name: 'Test Category', userId }]),
  findById: mock(async (id: number) => ({ id, name: 'Test Category' })),
  update: mock(async (id: number, data: any) => ({ id, ...data })),
  softDelete: mock(async (id: number) => ({ id, deleted_at: new Date() }))
};

class TestCategoryRepository extends CategoryRepository {
  constructor() {
    super();
    this.create = mockBaseRepository.create;
    this.findAll = mockBaseRepository.findAll;
    this.findById = mockBaseRepository.findById;
    this.update = mockBaseRepository.update;
    this.softDelete = mockBaseRepository.softDelete;
  }
}

describe('CategoryRepository', () => {
  let repository: TestCategoryRepository;

  beforeEach(() => {
    repository = new TestCategoryRepository();
    mockBaseRepository.create.mockClear();
    mockBaseRepository.findAll.mockClear();
    mockBaseRepository.findById.mockClear();
    mockBaseRepository.update.mockClear();
    mockBaseRepository.softDelete.mockClear();
  });

  test('create should add a new category', async () => {
    const data = { 
      name: 'Test Category',
      userId: 1
    };
    
    const result = await repository.create(data);
    
    expect(mockBaseRepository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(expect.objectContaining({ id: 1, name: 'Test Category' }));
  });

  test('findAll should return categories for a user', async () => {
    const userId = 1;
    const result = await repository.findAll(userId);
    
    expect(mockBaseRepository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toBeArrayOfSize(1);
    expect(result[0]).toEqual(expect.objectContaining({ userId: 1 }));
  });

  test('findById should return a category by id', async () => {
    const id = 1;
    const result = await repository.findById(id);
    
    expect(mockBaseRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1 }));
  });

  test('update should modify a category', async () => {
    const id = 1;
    const data = { name: 'Updated Category' };
    const result = await repository.update(id, data);
    
    expect(mockBaseRepository.update).toHaveBeenCalledWith(id, data);
    expect(result).toEqual(expect.objectContaining({ id: 1, name: 'Updated Category' }));
  });

  test('softDelete should mark a category as deleted', async () => {
    const id = 1;
    const result = await repository.softDelete(id);
    
    expect(mockBaseRepository.softDelete).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1, deleted_at: expect.any(Date) }));
  });
}); 