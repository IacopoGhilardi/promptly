import { serial, varchar, jsonb } from "drizzle-orm/pg-core";
import { defaultSchema, timestamps } from "../db/helpers/columns";
import { queues } from "./queue";

export const queueJobStatusEnum = defaultSchema.enum('queue_job_status', ['pending', 'processing', 'completed', 'failed']);
export const queueJobTypeEnum = defaultSchema.enum('queue_job_type', ['reminder_email', 'reminder_sms', 'reminder_push']);

export const queueJobs = defaultSchema.table('queue_jobs', {
    id: serial('id').primaryKey(),
    queueName: varchar('queue_name', {length: 50}).notNull(),
    jobName: varchar('job_name', {length: 50}).notNull(),
    data: jsonb('data').notNull(),
    status: queueJobStatusEnum('status').notNull(),
    type: queueJobTypeEnum('type').notNull(),
    queueId: serial('queue_id').references(() => queues.id),
    ...timestamps,
});
