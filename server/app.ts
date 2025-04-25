import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { petsRoute } from './routes/petRoutes';
import { serveStatic } from 'hono/bun';
import { authRoute } from './routes/auth';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', logger());
app.use(
  '/api/*',
  cors({
    origin: 'https://pet-health-tracker.fly.dev',
    allowMethods: ['POST', 'GET'],
    credentials: true,
  }),
);

const apiRoutes = app.basePath('/api').route('/pets', petsRoute).route('/', authRoute);

app.get('*', serveStatic({ root: './client/dist' }));
app.get('*', serveStatic({ path: './client/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
