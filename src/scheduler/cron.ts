import { ReminderScheduler } from './reminder.scheduler';

export function initCronJobs() {
    const reminderScheduler = new ReminderScheduler();
    reminderScheduler.initReminderScheduler();
}