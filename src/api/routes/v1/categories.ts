import { Hono } from "hono";
import { categoryController } from "../../controllers/category.controller";
import { authMiddleware } from "../../middlewares/auth.midleware";

export function initCategoriesRoutes(app: Hono) {
    const categories = new Hono();
    
    // Secure all category routes with auth middleware
    categories.use('*', authMiddleware);
    
    categories.post('/', (c) => categoryController.createCategory(c));
    categories.get('/', (c) => categoryController.getCategories(c));
    categories.get('/:id', (c) => categoryController.getCategoryById(c));
    categories.put('/:id', (c) => categoryController.updateCategory(c));
    categories.delete('/:id', (c) => categoryController.deleteCategory(c));

    app.route('/categories', categories);
} 