import { serve } from '@hono/node-server';

import { app } from './app';
import { createConnection } from './db';
import { logger } from './helper';

export interface RunningOptions {
  port?: number;
  hostname?: string;
}

export interface WebExtensionHostOptions {}
export type HonoServeOptions = Parameters<typeof serve>[0];
export type ServeOptions = Omit<HonoServeOptions, 'fetch'>;

const serveDefaultOptions = {
  port: 80,
  hostname: '0.0.0.0',
} satisfies ServeOptions;

export class WebExtensionHost {
  constructor(private readonly options?: WebExtensionHostOptions) {}

  static #instance: WebExtensionHost;

  static async warmup(callback?: () => Promise<void>) {
    if (!this.#instance) {
      // NodeModuleExtHook.on('.js', async (filename, source) => {
      //   try {
      //     // if (isWithinPath(filename, import.meta.dirname)) {
      //     // }
      //     // await runtimeSecurityCheckup(filename, source);
      //     return source;
      //   } catch (error) {
      //     logger.error(error);
      //   }
      // });

      this.#instance = new WebExtensionHost();
    }

    await callback?.();
    createConnection();

    return this.#instance;
  }

  async run(options?: ServeOptions) {
    const opt = {
      ...serveDefaultOptions,
      ...(options as HonoServeOptions),
      fetch: app.fetch,
    };

    // setTimeout(async () => {
    //   await importScript(resolve(import.meta.dirname, './demo.cjs'));
    //   // await import(resolve('./demo.js'));
    // }, 1000);

    return serve(opt, ({ address, port }) => {
      logger.info(`Web Extension Host started on ${address}:${port}`);
    });
  }
}
