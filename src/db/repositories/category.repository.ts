import { eq, isNull } from 'drizzle-orm';
import dbConfig from '..';
import { categories } from '../../models/categories';
import { logger } from '../../utils/logger';

export class CategoryRepository {
  private db: any;

  constructor() {
    this.db = dbConfig.db;
  }

  async create(categoryData: any) {
    logger.info({ data: categoryData }, 'Creating category in database');
    const category = await this.db.insert(categories).values(categoryData).returning();
    return category[0];
  }

  async findAll(userId: number) {
    logger.info({ userId }, 'Fetching all categories from database for user');
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .where(isNull(categories.deleted_at));
    return result;
  }

  async findById(id: number) {
    logger.info({ categoryId: id }, 'Fetching category by ID from database');
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .where(isNull(categories.deleted_at));
    
    return result[0];
  }

  async update(id: number, categoryData: any) {
    logger.info({ categoryId: id }, 'Updating category in database');
    const result = await this.db
      .update(categories)
      .set({ ...categoryData, updated_at: new Date() })
      .where(eq(categories.id, id))
      .returning();
    
    return result[0];
  }

  async softDelete(id: number) {
    logger.info({ categoryId: id }, 'Soft deleting category in database');
    const result = await this.db
      .update(categories)
      .set({ deleted_at: new Date() })
      .where(eq(categories.id, id))
      .returning();
    
    return result[0];
  }
}

export const categoryRepository = new CategoryRepository(); 