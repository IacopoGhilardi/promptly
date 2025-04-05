import { pgTable, serial, varchar, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helpers/columns";

export const queueJobStatusEnum = pgEnum('queue_job_status', ['pending', 'processing', 'completed', 'failed']);
export const queueJobTypeEnum = pgEnum('queue_job_type', ['reminder_email', 'reminder_sms', 'reminder_push']);

export const queueJobs = pgTable('queue_jobs', {
    id: serial('id').primaryKey(),
    queueName: varchar({length: 50}).notNull(),
    jobName: varchar({length: 50}).notNull(),
    data: jsonb().notNull(),
    status: queueJobStatusEnum('status').notNull(),
    type: queueJobTypeEnum('type').notNull(),
    ...timestamps,
});
