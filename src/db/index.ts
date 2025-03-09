import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle({ connection: process.env.DATABASE_URL, casing: 'snake_case' });

async function pingDb() {
    return await db.execute('select 1');
}

export default {
    db,
    pingDb,
};