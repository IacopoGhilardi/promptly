import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { ReminderService } from '../../../api/services/reminder.service';
import { reminderRepository } from '../../../db/repositories/reminder.repository';

mock.module('../../../db/repositories/reminder.repository', () => ({
  reminderRepository: {
    create: mock(async (data: any) => ({ id: 1, ...data })),
    findAll: mock(async (userId: number) => [{ id: 1, title: 'Test Reminder', userId }]),
    findById: mock(async (id: number) => id === 999 ? null : { id, title: 'Test Reminder' }),
    update: mock(async (id: number, data: any) => id === 999 ? null : { id, ...data }),
    softDelete: mock(async (id: number) => id === 999 ? null : { id, deleted_at: new Date() })
  }
}));

mock.module('../../../utils/logger', () => ({
  logger: {
    info: () => {},
    warn: () => {},
    error: () => {}
  }
}));

describe('ReminderService', () => {
  let service: ReminderService;
  
  beforeEach(() => {
    service = new ReminderService();
  });

  test('createReminder should create and return a reminder', async () => {
    const data = {
      title: 'Test Reminder',
      description: 'Description',
      reminderDate: new Date(),
      reminderTime: new Date(),
      reminderType: 'task',
      reminderStatus: 'pending',
      categoryId: 1,
      priority: 'medium',
      userId: 1
    };
    
    const result = await service.createReminder(data);
    
    expect(reminderRepository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(expect.objectContaining({ id: 1, title: 'Test Reminder' }));
  });

  test('getReminders should return reminders for a user', async () => {
    const userId = 1;
    const result = await service.getReminders(userId);
    
    expect(reminderRepository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toBeArrayOfSize(1);
    expect(result[0]).toEqual(expect.objectContaining({ userId: 1 }));
  });

  test('getReminderById should return a reminder when found', async () => {
    const id = 1;
    const result = await service.getReminderById(id);
    
    expect(reminderRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1 }));
  });

  test('getReminderById should return null when not found', async () => {
    const id = 999;
    const result = await service.getReminderById(id);
    
    expect(reminderRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toBeNull();
  });

  test('updateReminder should update and return a reminder when found', async () => {
    const id = 1;
    const data = { title: 'Updated Reminder' };
    const result = await service.updateReminder(id, data);
    
    expect(reminderRepository.update).toHaveBeenCalledWith(id, data);
    expect(result).toEqual(expect.objectContaining({ id: 1, title: 'Updated Reminder' }));
  });

  test('updateReminder should return null when reminder not found', async () => {
    const id = 999;
    const data = { title: 'Updated Reminder' };
    const result = await service.updateReminder(id, data);
    
    expect(reminderRepository.update).toHaveBeenCalledWith(id, data);
    expect(result).toBeNull();
  });

  test('deleteReminder should delete and return a reminder when found', async () => {
    const id = 1;
    const result = await service.deleteReminder(id);
    
    expect(reminderRepository.softDelete).toHaveBeenCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id: 1, deleted_at: expect.any(Date) }));
  });

  test('deleteReminder should return null when reminder not found', async () => {
    const id = 999;
    const result = await service.deleteReminder(id);
    
    expect(reminderRepository.softDelete).toHaveBeenCalledWith(id);
    expect(result).toBeNull();
  });
}); 