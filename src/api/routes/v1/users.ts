import { Hono } from "hono"
import { usersController } from "../../controllers/users.controller"
import { authMiddleware } from "../../middlewares/auth.midleware"

export function initUsersRoutes(app: Hono) {
    const users = new Hono();
    
    users.post('/', (c) => usersController.createUser(c))
    users.get('/', authMiddleware, (c) => usersController.getUsers(c))
    users.get('/:id', authMiddleware, (c) => usersController.getUserById(c))
    users.put('/:id', authMiddleware, (c) => usersController.updateUser(c))
    users.delete('/:id', authMiddleware, (c) => usersController.deleteUser(c))

    app.route('/users', users)
}