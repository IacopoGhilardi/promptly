import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { BaseRepository } from '../../../db/repositories/base.repository';
import { eq, isNull, and } from 'drizzle-orm';

mock.module('../../../utils/logger', () => ({
  logger: {
    info: () => {},
    warn: () => {},
    error: () => {}
  }
}));

const mockDb = {
  insert: mock(() => ({
    values: mock(() => ({
      returning: mock(() => [{ id: 1, name: 'Test Item' }])
    }))
  })),
  select: mock(() => ({
    from: mock(() => ({
      where: mock(() => [{ id: 1, name: 'Test Item' }])
    }))
  })),
  update: mock(() => ({
    set: mock(() => ({
      where: mock(() => ({
        returning: mock(() => [{ id: 1, name: 'Updated Item' }])
      }))
    }))
  }))
};

mock.module('../../../db', () => ({
  default: {
    db: mockDb
  }
}));

class TestRepository extends BaseRepository<any> {
  constructor() {
    super(mockDb, { id: 'id', name: 'name', deleted_at: 'deleted_at', userId: 'userId' }, 'test');
    this.db = mockDb;
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
    mockDb.insert.mockClear();
    mockDb.select.mockClear();
    mockDb.update.mockClear();
  });

  test('create should insert data and return the result', async () => {
    const data = { name: 'Test Item' };
    const result = await repository.create(data);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: 'Test Item' });
  });

  test('findAll should return all items', async () => {
    const result = await repository.findAll();

    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toBeArrayOfSize(1);
    expect(result[0]).toEqual({ id: 1, name: 'Test Item' });
  });

  test('findAll with userId should filter by userId', async () => {
    const userId = 1;
    await repository.findAll(userId);

    expect(mockDb.select).toHaveBeenCalled();
  });

  test('findById should return item by id', async () => {
    const id = 1;
    const result = await repository.findById(id);

    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: 'Test Item' });
  });

  test('update should modify an item and return it', async () => {
    const id = 1;
    const data = { name: 'Updated Item' };
    const result = await repository.update(id, data);

    expect(mockDb.update).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: 'Updated Item' });
  });

  test('softDelete should set deleted_at and return the item', async () => {
    const id = 1;
    const result = await repository.softDelete(id);

    expect(mockDb.update).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: 'Updated Item' });
  });
}); 