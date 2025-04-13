import { Hono } from 'hono'
import { initRoutes } from './api/routes';
import { serve } from 'bun';
import { initCronJobs } from './scheduler/cron';
import { queueService } from '../services/queue.service';

const app = new Hono()
initRoutes(app);

const port = process.env.SERVER_PORT || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  port,
  fetch: app.fetch,
})

initCronJobs();
queueService.setupInitialQueues();