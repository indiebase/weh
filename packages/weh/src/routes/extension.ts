import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { TrieRouter } from 'hono/router/trie-router';
import { ExtensionLoader } from 'src/extension-loader';

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
  const { file } = c.req.valid('form');

  const loader = new ExtensionLoader();
  await loader.installFromWebStream(file);

  return c.json({});
});

export { extension };
