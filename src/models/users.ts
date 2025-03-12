import { pgTable, serial, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '../db/helpers/columns';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar({length: 50}).notNull(),
    email: varchar({length: 50}).notNull().unique(),
    password: text().notNull(),
    publicId: uuid('public_id').notNull().unique(),
    ...timestamps,
});
