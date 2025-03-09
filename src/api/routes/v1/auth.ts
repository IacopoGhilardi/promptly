import { Hono } from "hono";
import { authController } from "../../controllers/auth.controller";
import { authMiddleware } from "../../middlewares/auth.midleware";
import { jsonResponse, ResponseStatus } from "../../../utils/response";

export function initAuthRoutes(app: Hono) {
    const auth = new Hono();
    
    auth.post('/register', (c) => authController.register(c));
    auth.post('/login', (c) => authController.login(c));
    auth.post('/forgot-password', (c) => authController.forgotPassword(c));
    auth.post('/reset-password', (c) => authController.resetPassword(c));
    
    auth.get('/me', authMiddleware, async (c) => {
        const authData = c.get('auth');
        return jsonResponse(c, ResponseStatus.OK, {
            data: {
                userId: authData.userId,
                email: authData.email
            },
            message: 'Authentication valid'
        });
    });

    app.route('', auth);
}