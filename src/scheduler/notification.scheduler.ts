import { schedule } from 'node-cron';
import db from '../db';
import { Queue } from 'bullmq';



export function initNotificationScheduler() {
    
    schedule('*/5 * * * * *', () => {
        console.log('notificationScheduler NUmero 1');
    });
}