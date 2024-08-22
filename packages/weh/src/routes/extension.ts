import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { TrieRouter } from 'hono/router/trie-router';

import { extService } from '../services';
const extension = new OpenAPIHono({ router: new TrieRouter() });

const installRoute = createRoute({
  tags: ['Extensions'],
  description: 'Install extension',
  method: 'post',
  path: '/install',
  request: {
    body: {
      description: 'The contents of the signup request',
      required: true,
      content: {
        'multipart/form-data': {
          schema: z
            .object({
              file: z.custom<File>().openapi({
                format: 'binary',
                type: 'string',
              }),
              namespace: z.string().optional(),
              publisherId: z.string(),
            })
            .required(),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.any().optional(),
        },
      },
      description: '',
    },
  },
});

extension.openapi(installRoute, async (c) => {
  const form = c.req.valid('form');
  await extService.install(form);

  return c.json({
    message: 'Extension installed',
  });
});

export { extension };
