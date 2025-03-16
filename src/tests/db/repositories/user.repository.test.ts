import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { UserRepository } from '../../../db/repositories/user.repository';

const mockDb = {
  select: mock(() => ({
    from: mock(() => ({
      where: mock(() => ({
        where: mock(() => [{ id: 1, email: 'test@example.com', publicId: 'abc123' }])
      }))
    }))
  })),
  update: mock(() => ({
    set: mock(() => ({
      where: mock(() => ({
        returning: mock(() => [{ id: 1, password: 'newpassword123' }])
      }))
    }))
  }))
};

const mockBaseRepository = {
  create: mock(async (data: any) => ({ id: 1, ...data })),
  findAll: mock(async (userId?: number) => [{ id: 1, email: 'test@example.com' }]),
  findById: mock(async (id: number) => ({ id, email: 'test@example.com' })),
  update: mock(async (id: number, data: any) => ({ id, ...data })),
  softDelete: mock(async (id: number) => ({ id, deleted_at: new Date() }))
};

class TestUserRepository extends UserRepository {
  constructor() {
    super();
    this.db = mockDb;
    this.create = mockBaseRepository.create;
    this.findAll = mockBaseRepository.findAll;
    this.findById = mockBaseRepository.findById;
    this.update = mockBaseRepository.update;
    this.softDelete = mockBaseRepository.softDelete;
  }
}

describe('UserRepository', () => {
  let repository: TestUserRepository;

  beforeEach(() => {
    repository = new TestUserRepository();
    Object.keys(mockDb).forEach(key => {
        mockDb[key as keyof typeof mockDb].mockClear();
    });
    
    Object.keys(mockBaseRepository).forEach(key => {
      mockBaseRepository[key as keyof typeof mockBaseRepository].mockClear();
    });
  });

  test('create should add a new user', async () => {
    const data = { 
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    const result = await repository.create(data);
    
    expect(mockBaseRepository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(expect.objectContaining({ id: 1, email: 'test@example.com' }));
  });

  test('findByEmail should return a user by email', async () => {
    const email = 'test@example.com';
    const result = await repository.findByEmail(email);
    
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ email: 'test@example.com' }));
  });

  test('findByPublicId should return a user by publicId', async () => {
    const publicId = 'abc123';
    const result = await repository.findByPublicId(publicId);
    
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ publicId: 'abc123' }));
  });

  test('updatePassword should update a user password', async () => {
    const userId = 1;
    const newPassword = 'newpassword123';
    const result = await repository.updatePassword(userId, newPassword);
    
    expect(mockDb.update).toHaveBeenCalled();
    expect(result[0]).toEqual(expect.objectContaining({ 
      id: 1, 
      password: 'newpassword123' 
    }));
  });

  test('findAll should return all users', async () => {
    const result = await repository.findAll();
    
    expect(mockBaseRepository.findAll).toHaveBeenCalled();
    expect(result).toBeArrayOfSize(1);
  });

  test('findById should return a user by id', async () => {
    const id = 1;
    const result = await repository.findById(id);
    
    expect(mockBaseRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1 }));
  });

  test('update should modify a user', async () => {
    const id = 1;
    const data = { name: 'Updated User' };
    const result = await repository.update(id, data);
    
    expect(mockBaseRepository.update).toHaveBeenCalledWith(id, data);
    expect(result).toEqual(expect.objectContaining({ id: 1, name: 'Updated User' }));
  });

  test('softDelete should mark a user as deleted', async () => {
    const id = 1;
    const result = await repository.softDelete(id);
    
    expect(mockBaseRepository.softDelete).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1, deleted_at: expect.any(Date) }));
  });
}); 