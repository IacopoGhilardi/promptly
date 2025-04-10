import { pgSchema, timestamp } from 'drizzle-orm/pg-core';

export const defaultSchema = pgSchema('promptly');

export const timestamps = {
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  }
  