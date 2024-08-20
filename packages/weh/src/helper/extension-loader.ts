import { promises as afs } from 'node:fs';
import { extname, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { did } from '@deskbtm/gadgets/did';
import { Manifest } from '@indiebase/weh-edk';
import { WehTables } from '@indiebase/weh-sdk/weh-tables';
import { HTTPException } from 'hono/http-exception';
import unzipper from 'unzipper';

import { EXTENSIONS_HOME } from '../constants';
import { db } from '../db';
import { MigrationSource } from '../migrations';
import { Extension } from '../models/extension';
import { InternalServerErrorException } from './http-exceptions';
import { logger } from './logger';
import { manifestSchema } from './manifest-schema';
import { importScript } from './utils';

export class ExtensionLoader {
  public async installFromWebStream(namespace: string, file: File) {
    if (!file) {
      throw new HTTPException(400, { message: 'File is required' });
    }

    const wehDir = await this.prepareHome();
    const extDir = resolve(wehDir, file.name.replace(extname(file.name), ''));
    const extManifestPath = resolve(extDir, 'manifest.js');

    await this.extract(file, wehDir, extDir);
    const manifest = await importScript(extManifestPath).catch((error) => {
      if (error?.code === 'ERR_MODULE_NOT_FOUND') {
        throw new HTTPException(400, {
          message: `manifest.js is not found in ${file.name}`,
        });
      }
      throw new HTTPException(400, {
        message: `Installer package ${file.name} is not available`,
      });
    });
    const legalManifest = await this.validateManifest(manifest);
    const { packageName, version, name } = legalManifest;
    await afs.rename(extDir, resolve(wehDir, `${packageName}@${version}`));
    try {
      await this.createRegistry(namespace);

      const ext = new Extension(namespace);

      await new Extension(namespace).create({
        name,
        path: extDir,
        manifest: legalManifest,
      });
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private async createRegistry(namespace = 'public') {
    return db.migrate.up({
      migrationSource: new MigrationSource(namespace),
      tableName: WehTables._migrations,
      schemaName: namespace,
    });
  }

  private async extract(file: File, wehDir: string, extDir: string) {
    return new Promise((resolve) => {
      const nodeStream = Readable.fromWeb(file.stream());
      nodeStream
        .pipe(unzipper.Extract({ path: wehDir }))
        .on('error', async (error) => {
          logger.error(error);
          await afs.rm(extDir, { recursive: true, force: true });
          throw new HTTPException(400, {
            message: `Installer package ${file.name} is not available`,
          });
        })
        .on('finish', resolve);
    });
  }

  private async validateManifest(manifest: Manifest) {
    try {
      const m = await manifestSchema.parseAsync(manifest);
      return m;
    } catch (error) {
      logger.error(error);
      throw new HTTPException(400, {
        message: 'Manifest validate failed',
        cause: error,
      });
    }
  }

  public async uninstall(path: string) {
    try {
      return afs.rm(path, { recursive: true });
    } catch (err) {
      logger.error(err);
    }
  }

  private async prepareHome() {
    const [err, s] = await did(afs.stat(EXTENSIONS_HOME));

    if (err || !s.isDirectory()) {
      await afs.mkdir(EXTENSIONS_HOME);
    }

    return EXTENSIONS_HOME;
  }

  inspectExtRoutes() {}

  checksum() {}

  public downloadFromRemote() {}
}
