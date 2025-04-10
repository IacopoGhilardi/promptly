import { categories } from '../../models/categories';
import { BaseRepository } from './base.repository';
import dbConfig from '../index';

export class CategoryRepository extends BaseRepository<typeof categories> {
  constructor() {
    super(dbConfig.db, categories, 'category', dbConfig.redisConnection);
  }
}

export const categoryRepository = new CategoryRepository(); 