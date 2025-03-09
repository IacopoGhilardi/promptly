import { eq, isNull } from 'drizzle-orm';
import dbConfig from '..';
import { users } from '../../models/users';
import { logger } from '../../utils/logger';

export class UserRepository {
  private db: any;

  constructor() {
    this.db = dbConfig.db;
  }

  async create(userData: any) {
    logger.info({ data: { ...userData, password: '***' } }, 'Creating user in database');
    const user = await this.db.insert(users).values(userData).returning();
    return user[0];
  }

  async findAll() {
    logger.info('Fetching all users from database');
    await dbConfig.pingDb();
    const result = await this.db.select().from(users).where(isNull(users.deleted_at));
    return result;
  }

  async findByPublicId(publicId: string) {
    logger.info({ userId: publicId }, 'Fetching user by ID from database');
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.publicId, publicId))
      .where(isNull(users.deleted_at));
    
    return result[0];
  }

  async update(publicId: string, userData: any) {
    logger.info({ userId: publicId }, 'Updating user in database');
    const result = await this.db
      .update(users)
      .set({ ...userData, updated_at: new Date() })
      .where(eq(users.publicId, publicId))
      .returning();
    
    return result[0];
  }

  async softDelete(publicId: string) {
    logger.info({ userId: publicId }, 'Soft deleting user in database');
    const result = await this.db
      .update(users)
      .set({ deleted_at: new Date() })
      .where(eq(users.publicId, publicId))
      .returning();
    
    return result[0];
  }

  async findByEmail(email: string) {
    logger.info({ email }, 'Fetching user by email from database');
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .where(isNull(users.deleted_at));
    
    return result[0];
  }

  async updatePassword(userId: number, newPassword: string) {
    return this.db.update(users)
      .set({ password: newPassword, updated_at: new Date() })
      .where(eq(users.id, userId))
      .returning();
  }
}

export const userRepository = new UserRepository(); 