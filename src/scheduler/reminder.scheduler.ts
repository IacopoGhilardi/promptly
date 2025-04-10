import { schedule } from 'node-cron';
import db from '../db';
import { Queue } from 'bullmq';
import { reminderRepository } from '../db/repositories/reminder.repository';
import { logger } from '../utils/logger';
import { queueRepository } from '../db/repositories/queue.repository';
import { queueService } from '../../services/queue.service';

export class ReminderScheduler {
    constructor() {
        this.initReminderScheduler();
    }

    initReminderScheduler() {
        schedule('*/5 * * * * *', () => {
            this.checkOnTodayRemindersAndCreateQueue();
        });
    }


    async checkOnTodayRemindersAndCreateQueue() {
        const reminders = await reminderRepository.getNextDailyReminders(new Date(), new Date());
        logger.info({ reminders }, 'Reminders fetched, checking if queue exists');

        const queue = await queueService.getQueueFromRedis('reminder');
        if (queue) {
            logger.info({ queue }, 'Queue already exists, skipping');
            return;
        } else {
            logger.info({ reminders }, 'Queue does not exist, creating queue');
            await queueService.addQueueToRedis('reminder', reminders);
            logger.info({ reminders }, 'Queue created');
        }
    }


    async checkOnNextHalfHourReminders() {
        const reminders = await reminderRepository.getNextReminders(0, 0.5);
        console.log(reminders);
    }
    
    
}