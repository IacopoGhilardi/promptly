import { schedule } from 'node-cron';
import db from '../db';
import { Queue } from 'bullmq';

export function initNotificationScheduler() {
    
    schedule('*/5 * * * * *', () => {
        console.log('notificationScheduler NUmero 1');
    });
}

const createNotificationQueue = async () => {
    const queue = new Queue('createNotification', {
        connection: db.redisConnection,
    });
}