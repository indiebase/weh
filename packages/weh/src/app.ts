import { serveStatic } from '@hono/node-server/serve-static';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { TrieRouter } from 'hono/router/trie-router';

import { createOpenApiDoc } from './docs';
import { extension } from './routes';

const app = new OpenAPIHono({ router: new TrieRouter() });

app.route('/~weh/extension', extension);
app.use('/public/*', serveStatic({ root: './' }));
app.use(cors());

createOpenApiDoc(app);

export { app };
