import { eq, isNull } from 'drizzle-orm';
import { users } from '../../models/users';
import { BaseRepository } from './base.repository';
import { logger } from '../../utils/logger';

export class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(users, 'user');
  }

  // Metodi specifici per User
  async findByPublicId(publicId: string) {
    logger.info({ userId: publicId }, 'Fetching user by ID from database');
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.publicId, publicId))
      .where(isNull(this.table.deleted_at));
    
    return result[0];
  }

  async findByEmail(email: string) {
    logger.info({ email }, 'Fetching user by email from database');
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.email, email))
      .where(isNull(this.table.deleted_at));
    
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