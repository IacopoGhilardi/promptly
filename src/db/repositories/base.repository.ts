import { eq, isNull, and } from 'drizzle-orm';
import { logger } from '../../utils/logger';


export class BaseRepository<T> {
  protected redisConnection: any;
  protected db: any;
  protected table: any;
  protected tableName: string;

  constructor(db: any, table: any, tableName: string, redisConnection: any) {
    this.db = db;
    this.table = table;
    this.tableName = tableName;
    this.redisConnection = redisConnection;
  }

  async create(data: any) {
    logger.info({ data: { ...data } }, `Creating ${this.tableName} in database`);
    const result = await this.db.insert(this.table).values(data).returning();
    return result[0];
  }

  async findAll(userId?: number) {
    logger.info({ userId }, `Fetching all ${this.tableName}s from database`);
    let query = this.db.select().from(this.table).where(isNull(this.table.deleted_at));
    
    if (userId) {
        query = this.db.select().from(this.table).where(and(eq(this.table.userId, userId), isNull(this.table.deleted_at)));
    }
    
    return await query;
  }

  async findById(id: number) {
    logger.info({ id }, `Fetching ${this.tableName} by ID from database`);
    
    const result = await this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.id, id),
          isNull(this.table.deleted_at)
        )
      );
    
    return result[0];
  }

  async findByPublicId(publicId: string) {
    logger.info({ publicId }, `Fetching ${this.tableName} by public ID from database`);
    const result = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.publicId, publicId), isNull(this.table.deleted_at)));

    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }

  async update(id: number, data: any) {
    logger.info({ id }, `Updating ${this.tableName} in database`);
    const result = await this.db
      .update(this.table)
      .set({ ...data, updated_at: new Date() })
      .where(eq(this.table.id, id))
      .returning();
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }

  async softDelete(id: number) {
    logger.info({ id }, `Soft deleting ${this.tableName} in database`);
    const result = await this.db
      .update(this.table)
      .set({ deleted_at: new Date() })
      .where(eq(this.table.id, id))
      .returning();
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }

  async delete(id: number) {
    logger.info({ id }, `Deleting ${this.tableName} in database`);
    const result = await this.db.delete(this.table).where(eq(this.table.id, id));
    return result;
  }
} 