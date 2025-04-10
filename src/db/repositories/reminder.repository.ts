import { reminders } from '../../models/reminder';
import { BaseRepository } from './base.repository';
import dbConfig from '../index';
import { and, asc, gte, lte } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export class ReminderRepository extends BaseRepository<typeof reminders> {
  constructor() {
    super(dbConfig.db, reminders, 'reminder', dbConfig.redisConnection);
  }

  async getTodayRemindersPaged(page: number, limit: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminderList: typeof reminders.$inferSelect[] = await this.db
    .select()
    .from(reminders)
    .where(and(
      eq(reminders.reminderDate, today),
      eq(reminders.isActive, true)
    ))
    .orderBy(asc(reminders.reminderDate)) 
    .limit(limit)
    .offset((page - 1) * limit);

    return reminderList;
  }

  async getNextDailyReminders(from: Date, to: Date) {
    const reminderList: typeof reminders.$inferSelect[] = await this.db
    .select()
    .from(reminders)
    .where(and(
      gte(reminders.reminderDate, from),
      lte(reminders.reminderDate, to),
      eq(reminders.isActive, true)
    )) 
  }

  async getNextReminders(hourFrom: number, hourTo: number) {
    const from = new Date();
    from.setHours(hourFrom, 0, 0, 0);
    const to = new Date(from.getTime() + hourTo * 60 * 60 * 1000);

    const reminderList: typeof reminders.$inferSelect[] = await this.db
    .select()
    .from(reminders)
    .where(and(
      gte(reminders.reminderDate, from),
      lte(reminders.reminderDate, to),
      eq(reminders.isActive, true)
    ));

    return reminderList;
  }
}

export const reminderRepository = new ReminderRepository();