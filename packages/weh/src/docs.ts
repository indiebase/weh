import { SwaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

const swaggerUI = SwaggerUI({
  url: '/openapi',
  manuallySwaggerUIHtml: () => /*html*/ `
  <div>
    <div id="swagger-ui"></div>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          dom_id: '#swagger-ui',
          url: '/openapi'
        })
      }
    </script>
  </div>`,
});

export function createOpenApiDoc(app: OpenAPIHono) {
  app.doc31('/openapi', (c) => {
    return {
      openapi: '3.1.0',
      info: {
        version: '1.0.0',
        title: 'Web Extension Host built-in APIs',
      },
      servers: [
        {
          url: new URL(c.req.url).origin,
          description: 'dev',
        },
      ],
    };
  });

  app.get('/docs', (c) => {
    return c.html(/*html*/ `
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="SwaggerUI" />
            <script src="/public/swagger-ui-dist/swagger-ui-bundle.min.js"></script>
            <link href="/public/swagger-ui-dist/swagger-ui.min.css" rel="stylesheet">
            <title>Web Extension Host APIs</title>
          </head>
          <body>
            ${swaggerUI}
          </body>
        </html>
      `);
  });
}
