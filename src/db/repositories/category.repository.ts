import { categories } from '../../models/categories';
import { BaseRepository } from './base.repository';

export class CategoryRepository extends BaseRepository<typeof categories> {
  constructor() {
    super(categories, 'category');
  }
}

export const categoryRepository = new CategoryRepository(); 