import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { defaultSchema, timestamps } from '../db/helpers/columns';
import { users } from './users';

export const categories = defaultSchema.table('categories', {
    id: serial('id').primaryKey(),
    name: varchar({length: 50}).notNull(),
    userId: integer('user_id').notNull().references(() => users.id),
    ...timestamps,
});
