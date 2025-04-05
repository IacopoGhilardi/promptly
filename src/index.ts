import { Hono } from 'hono'
import { initRoutes } from './api/routes';
import { serve } from 'bun';
import { initCronJobs } from './scheduler/cron';

const app = new Hono()
initRoutes(app);

const port = process.env.SERVER_PORT || 3000;
console.log(`Server is running on http://localhost:${port}`);

initCronJobs();

serve({
  port,
  fetch: app.fetch,
})