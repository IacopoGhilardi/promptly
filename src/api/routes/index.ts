import { Hono } from "hono";
import { initUsersRoutes } from "./v1/users";
import { initAuthRoutes } from "./v1/auth";
import { initCategoriesRoutes } from "./v1/categories";
import { initRemindersRoutes } from "./v1/reminders";

export function initRoutes(app: Hono) {
  const v1 = new Hono();
  
  initUsersRoutes(v1);
  initAuthRoutes(v1);
  initCategoriesRoutes(v1);
  initRemindersRoutes(v1);
  
  app.route('/api/v1', v1);
}
