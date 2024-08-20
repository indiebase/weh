import { resolve } from 'node:path';

import { serve } from '@hono/node-server';

import { app } from './app';
import { importScript, isWithinPath, logger } from './helper';
import { NodeModuleExtHook } from './helper/module-extension-hook';
import { db } from './db';
import { MigrationSource, WehTables } from './migrations';

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

  static warmup() {
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

    return this.#instance;
  }

  async initializeDatabase() {
    await db.migrate.up({
      migrationSource: new MigrationSource('public'),
      tableName: WehTables._migrations,
      // schemaName: ,
    });
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
