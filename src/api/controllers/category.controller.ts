import { Context } from 'hono';
import { categoryService } from '../../../services/category.service';
import { jsonResponse, ResponseStatus } from '../../utils/response';
import { logger } from '../../utils/logger';

export class CategoryController {
  async createCategory(c: Context) {
    try {
      const body = await c.req.json();
      const auth = c.get('auth');
      
      // Add the authenticated user's ID to the category
      const categoryData = {
        ...body,
        userId: parseInt(auth.userId)
      };
      
      const category = await categoryService.createCategory(categoryData);
      
      return jsonResponse(c, ResponseStatus.OK, { 
        data: category,
        message: 'Category created successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to create category');
      
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to create category',
        statusCode: 400
      });
    }
  }

  async getCategories(c: Context) {
    try {
      const auth = c.get('auth');
      const userId = parseInt(auth.userId);
      
      const categories = await categoryService.getCategories(userId);
      
      return jsonResponse(c, ResponseStatus.OK, { data: categories });
    } catch (error) {
      logger.error(error, 'Failed to fetch categories');
      
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to fetch categories',
        statusCode: 500
      });
    }
  }

  async getCategoryById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const auth = c.get('auth');
      
      const category = await categoryService.getCategoryById(id);
      
      if (!category) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Category not found',
          statusCode: 404
        });
      }
      
      // Ensure user can only access their own categories
      if (category.userId !== parseInt(auth.userId)) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Unauthorized access to category',
          statusCode: 403
        });
      }
      
      return jsonResponse(c, ResponseStatus.OK, { data: category });
    } catch (error) {
      logger.error(error, 'Failed to fetch category');
      
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to fetch category',
        statusCode: 500
      });
    }
  }

  async updateCategory(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const body = await c.req.json();
      const auth = c.get('auth');
      
      // First, verify that the category belongs to the user
      const existingCategory = await categoryService.getCategoryById(id);
      
      if (!existingCategory) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Category not found',
          statusCode: 404
        });
      }
      
      if (existingCategory.userId !== parseInt(auth.userId)) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Unauthorized access to category',
          statusCode: 403
        });
      }
      
      const category = await categoryService.updateCategory(id, body);
      
      return jsonResponse(c, ResponseStatus.OK, { 
        data: category,
        message: 'Category updated successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to update category');
      
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to update category',
        statusCode: 400
      });
    }
  }

  async deleteCategory(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const auth = c.get('auth');
      
      // First, verify that the category belongs to the user
      const existingCategory = await categoryService.getCategoryById(id);
      
      if (!existingCategory) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Category not found',
          statusCode: 404
        });
      }
      
      if (existingCategory.userId !== parseInt(auth.userId)) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Unauthorized access to category',
          statusCode: 403
        });
      }
      
      const category = await categoryService.deleteCategory(id);
      
      return jsonResponse(c, ResponseStatus.OK, { 
        message: 'Category deleted successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to delete category');
      
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to delete category',
        statusCode: 500
      });
    }
  }
}

export const categoryController = new CategoryController(); 