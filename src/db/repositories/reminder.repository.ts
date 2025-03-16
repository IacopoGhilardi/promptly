import { reminders } from '../../models/reminder';
import { BaseRepository } from './base.repository';
import dbConfig from '../index';

export class ReminderRepository extends BaseRepository<typeof reminders> {
  constructor() {
    super(dbConfig.db, reminders, 'reminder');
  }
}

export const reminderRepository = new ReminderRepository();