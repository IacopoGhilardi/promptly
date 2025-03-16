import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { ReminderRepository } from '../../../db/repositories/reminder.repository';
import { reminders } from '../../../models/reminder';

const mockBaseRepository = {
  create: mock(async (data: any) => ({ id: 1, ...data })),
  findAll: mock(async (userId?: number) => [{ id: 1, title: 'Test Reminder', userId }]),
  findById: mock(async (id: number) => ({ id, title: 'Test Reminder' })),
  update: mock(async (id: number, data: any) => ({ id, ...data })),
  softDelete: mock(async (id: number) => ({ id, deleted_at: new Date() }))
};

class TestReminderRepository extends ReminderRepository {
  constructor() {
    super();
    this.create = mockBaseRepository.create;
    this.findAll = mockBaseRepository.findAll;
    this.findById = mockBaseRepository.findById;
    this.update = mockBaseRepository.update;
    this.softDelete = mockBaseRepository.softDelete;
  }
}

describe('ReminderRepository', () => {
  let repository: TestReminderRepository;

  beforeEach(() => {
    repository = new TestReminderRepository();
    mockBaseRepository.create.mockClear();
    mockBaseRepository.findAll.mockClear();
    mockBaseRepository.findById.mockClear();
    mockBaseRepository.update.mockClear();
    mockBaseRepository.softDelete.mockClear();
  });

  test('create should add a new reminder', async () => {
    const data = { 
      title: 'Test Reminder', 
      description: 'Test description',
      reminderDate: new Date(),
      reminderTime: new Date(),
      reminderType: 'task',
      reminderStatus: 'pending',
      categoryId: 1,
      priority: 'medium',
      userId: 1
    };
    
    const result = await repository.create(data);
    
    expect(mockBaseRepository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(expect.objectContaining({ id: 1, title: 'Test Reminder' }));
  });

  test('findAll should return reminders for a user', async () => {
    const userId = 1;
    const result = await repository.findAll(userId);
    
    expect(mockBaseRepository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toBeArrayOfSize(1);
    expect(result[0]).toEqual(expect.objectContaining({ userId: 1 }));
  });

  test('findById should return a reminder by id', async () => {
    const id = 1;
    const result = await repository.findById(id);
    
    expect(mockBaseRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1 }));
  });

  test('update should modify a reminder', async () => {
    const id = 1;
    const data = { title: 'Updated Reminder' };
    const result = await repository.update(id, data);
    
    expect(mockBaseRepository.update).toHaveBeenCalledWith(id, data);
    expect(result).toEqual(expect.objectContaining({ id: 1, title: 'Updated Reminder' }));
  });

  test('softDelete should mark a reminder as deleted', async () => {
    const id = 1;
    const result = await repository.softDelete(id);
    
    expect(mockBaseRepository.softDelete).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1, deleted_at: expect.any(Date) }));
  });
}); 