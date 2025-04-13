import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { defaultSchema, timestamps } from "../db/helpers/columns";

export const QUEUE_TYPE = {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
} as const;

export const QUEUE_STATUS = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    STOPPED: 'stopped',
} as const;

export const BASE_QUEUES = [
    {
        queueName: 'email_queue',
        queueType: QUEUE_TYPE.EMAIL,
        queueStatus: QUEUE_STATUS.ACTIVE,
    },
    {
        queueName: 'sms_queue',
        queueType: QUEUE_TYPE.SMS,
        queueStatus: QUEUE_STATUS.ACTIVE,
    },
    {
        queueName: 'push_queue',
        queueType: QUEUE_TYPE.PUSH,
        queueStatus: QUEUE_STATUS.ACTIVE,
    }
]

export const queues = defaultSchema.table('queues', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    type: text('type').notNull(), // email, sms, push, etc.
    status: text('status').notNull().default(QUEUE_STATUS.ACTIVE), // active, paused, stopped
    concurrency: integer('concurrency').notNull().default(1),
    ...timestamps,
});