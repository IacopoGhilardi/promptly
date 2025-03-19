import { and, eq, isNull } from 'drizzle-orm';
import { users } from '../../models/users';
import { BaseRepository } from './base.repository';
import { logger } from '../../utils/logger';
import dbConfig from '../index';

export class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(dbConfig.db, users, 'user');
  }

  async findByPublicId(publicId: string) {
    logger.info({ userId: publicId }, 'Fetching user by ID from database');
    const result = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.publicId, publicId), isNull(this.table.deleted_at)));
    
    return result[0];
  }

  async findByEmail(email: string) {
    logger.info({ email }, 'Fetching user by email from database');
    const result = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.email, email), isNull(this.table.deleted_at)));

    if (result.length === 0) {
      return null;
    }

    logger.info(result, 'User found by email');
    
    return result[0];
  }

  async updatePassword(userId: number, newPassword: string) {
    return this.db.update(this.table)
      .set({ password: newPassword, updated_at: new Date() })
      .where(eq(this.table.id, userId))
      .returning();
  }
}

export const userRepository = new UserRepository(); 