import db from "../db";

export const QUEUE_NAME = {
    REMINDER_EMAIL: 'reminder_email',
    REMINDER_SMS: 'reminder_sms',
    REMINDER_PUSH: 'reminder_push',
} as const;

export const WORKER_CONCURRENCY = {
    REMINDER_EMAIL: 1,
    REMINDER_SMS: 1,
    REMINDER_PUSH: 1,
} as const;


export const DEFAULT_QUEUE_OPTIONS = {
    connection: db.redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 200,
    },
} as const;