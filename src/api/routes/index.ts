import { Hono } from "hono";
import { initUsersRoutes } from "./v1/users";
import { initAuthRoutes } from "./v1/auth";

export function initRoutes(app: Hono) {
  const v1 = new Hono();
  
  initUsersRoutes(v1);
  initAuthRoutes(v1);
  app.route('/api/v1', v1);
}
