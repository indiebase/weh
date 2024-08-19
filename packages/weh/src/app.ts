import { serveStatic } from '@hono/node-server/serve-static';
import { OpenAPIHono } from '@hono/zod-openapi';
import { TrieRouter } from 'hono/router/trie-router';

import { createOpenApiDoc } from './docs';
import { extension } from './routes';

const app = new OpenAPIHono({ router: new TrieRouter() });

app.route('/~weh/extension', extension);
app.use('/public/*', serveStatic({ root: './' }));

createOpenApiDoc(app);

export { app };
