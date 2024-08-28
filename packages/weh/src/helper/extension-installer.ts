import { promises as afs } from 'node:fs';
import { extname, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { did } from '@deskbtm/gadgets/did';
import { Manifest } from '@indiebase/weh-edk';
import { WehTables } from '@indiebase/weh-sdk/weh-tables';
import { HTTPException } from 'hono/http-exception';
import unzipper from 'unzipper';

import { EXTENSIONS_HOME, EXTENSIONS_TMP } from '../constants';
import { db } from '../db';
import { MigrationSource } from '../migrations';
import { Extension } from '../models/extension';
import { createSchemaIfNotExist } from './db-utils';
import { InternalServerErrorException } from './http-exceptions';
import { logger } from './logger';
import { manifestSchema } from './manifest-schema';
import { importScript } from './utils';

export interface InstallRequired {
  publisherId: string;
  namespace: string;
  file: File;
}

export class ExtensionInstaller {
  public async installFromWebStream({
    publisherId,
    namespace,
    file,
  }: InstallRequired) {
    if (!file) {
      throw new HTTPException(400, { message: 'File is required' });
    }

    await this.prepare();

    const extName = file.name.replace(extname(file.name), '');
    const extTmpDir = resolve(EXTENSIONS_TMP, extName);
    const extManifestTmpPath = resolve(extTmpDir, 'manifest.js');

    await this.extract(file, EXTENSIONS_TMP);

    const manifest = await importScript(extManifestTmpPath).catch((error) => {
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
    const ext = new Extension(namespace);

    try {
      await this.createRegistry(namespace);
      const extInfo = await ext.findByPackageName(packageName);
      const id = db.fn.uuid();

      if (Array.isArray(extInfo) && extInfo.length < 1) {
        const extId = await ext
          .create({
            id,
            name,
            path: extDir,
            manifest: legalManifest,
            publisherId,
            version,
            packageName,
          })
          .returning('id');
        await afs.rename(extDir, resolve(wehDir, extId[0].id));
      } else {
      }
    } catch (error) {
      logger.error(String(error));
      throw new InternalServerErrorException();
    }
  }

  private async createRegistry(namespace = 'public') {
    await createSchemaIfNotExist(db, namespace);

    return db.migrate.up({
      migrationSource: new MigrationSource(namespace),
      tableName: WehTables._migrations,
      schemaName: namespace,
    });
  }

  private async extract(file: File, wehDir: string) {
    return new Promise((resolve) => {
      const nodeStream = Readable.fromWeb(file.stream());
      nodeStream
        .pipe(unzipper.Extract({ path: wehDir }))
        .on('error', async (error) => {
          logger.error(String(error));
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
      logger.error(String(error));
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

  private async prepare() {
    const [err, s] = await did(afs.stat(EXTENSIONS_HOME));
    const [err1, s1] = await did(afs.stat(EXTENSIONS_TMP));

    if (err || !s.isDirectory()) {
      await afs.mkdir(EXTENSIONS_HOME, { recursive: true });
    }

    if (err1 || !s1.isDirectory()) {
      await afs.mkdir(EXTENSIONS_TMP, { recursive: true });
    }
  }
}
