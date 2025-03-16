import { reminderRepository } from '../../db/repositories/reminder.repository';
import { logger } from '../../utils/logger';

export interface CreateReminderDto {
  title: string;
  description: string;
  reminderDate: Date;
  reminderTime: Date;
  endTime?: Date;
  isRecurring?: boolean;
  recurringPeriod?: string;
  customInterval?: number;
  intervalUnit?: string;
  recurringStartDate?: Date;
  recurringEndDate?: Date;
  reminderType: string;
  reminderStatus: string;
  categoryId: number;
  priority: string;
  userId: number;
  notifyBefore?: number;
  notes?: string;
  locationText?: string;
}

export interface UpdateReminderDto extends Partial<CreateReminderDto> {}

export class ReminderService {
  async createReminder(data: CreateReminderDto) {
    logger.info({ data: { ...data } }, 'Creating new reminder');
    
    const reminder = await reminderRepository.create(data);
    logger.info({ reminderId: reminder.id }, 'Reminder created successfully');
    
    return reminder;
  }

  async getReminders(userId: number) {
    logger.info({ userId }, 'Fetching all reminders for user');
    const reminders = await reminderRepository.findAll(userId);
    logger.info({ userId, count: reminders.length }, 'Reminders fetched successfully');
    
    return reminders;
  }

  async getReminderById(id: number) {
    logger.info({ reminderId: id }, 'Fetching reminder by ID');
    const reminder = await reminderRepository.findById(id);
    
    if (!reminder) {
      logger.warn({ reminderId: id }, 'Reminder not found');
    } else {
      logger.info({ reminderId: id }, 'Reminder fetched successfully');
    }
    
    return reminder;
  }

  async updateReminder(id: number, data: UpdateReminderDto) {
    logger.info({ reminderId: id, data }, 'Updating reminder');
    
    const reminder = await reminderRepository.update(id, data);
    
    if (!reminder) {
      logger.warn({ reminderId: id }, 'Reminder not found for update');
    } else {
      logger.info({ reminderId: id }, 'Reminder updated successfully');
    }
    
    return reminder;
  }

  async deleteReminder(id: number) {
    logger.info({ reminderId: id }, 'Deleting reminder');
    const reminder = await reminderRepository.softDelete(id);
    
    if (!reminder) {
      logger.warn({ reminderId: id }, 'Reminder not found for deletion');
    } else {
      logger.info({ reminderId: id }, 'Reminder deleted successfully');
    }
    
    return reminder;
  }
}

export const reminderService = new ReminderService();
