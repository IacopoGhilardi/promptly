import { reminders } from '../../models/reminder';
import { BaseRepository } from './base.repository';

export class ReminderRepository extends BaseRepository<typeof reminders> {
  constructor() {
    super(reminders, 'reminder');
  }
}

export const reminderRepository = new ReminderRepository();