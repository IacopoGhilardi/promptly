import { categoryRepository } from '../src/db/repositories/category.repository';
import { logger } from '../src/utils/logger';

export interface CreateCategoryDto {
  name: string;
  userId: number;
}

export interface UpdateCategoryDto {
  name?: string;
}

export class CategoryService {
  async createCategory(data: CreateCategoryDto) {
    logger.info({ data }, 'Creating new category');
    
    const category = await categoryRepository.create(data);
    logger.info({ categoryId: category.id }, 'Category created successfully');
    
    return category;
  }

  async getCategories(userId: number) {
    logger.info({ userId }, 'Fetching all categories for user');
    const categories = await categoryRepository.findAll(userId);
    logger.info({ userId, count: categories.length }, 'Categories fetched successfully');
    
    return categories;
  }

  async getCategoryById(id: number) {
    logger.info({ categoryId: id }, 'Fetching category by ID');
    const category = await categoryRepository.findById(id);
    
    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found');
    } else {
      logger.info({ categoryId: id }, 'Category fetched successfully');
    }
    
    return category;
  }

  async updateCategory(id: number, data: UpdateCategoryDto) {
    logger.info({ categoryId: id, data }, 'Updating category');
    
    const category = await categoryRepository.update(id, data);
    
    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found for update');
    } else {
      logger.info({ categoryId: id }, 'Category updated successfully');
    }
    
    return category;
  }

  async deleteCategory(id: number) {
    logger.info({ categoryId: id }, 'Deleting category');
    const category = await categoryRepository.softDelete(id);
    
    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found for deletion');
    } else {
      logger.info({ categoryId: id }, 'Category deleted successfully');
    }
    
    return category;
  }
}

export const categoryService = new CategoryService();