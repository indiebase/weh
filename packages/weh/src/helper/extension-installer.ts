/* eslint-disable security/detect-non-literal-fs-filename */
import { randomUUID } from 'node:crypto';
import { promises as afs } from 'node:fs';
import { extname, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { did } from '@deskbtm/gadgets/did';
import { Manifest } from '@indiebase/weh-edk';
import { WehTables } from '@indiebase/weh-sdk/weh-tables';
import unzipper from 'unzipper';

import { EXTENSIONS_HOME, EXTENSIONS_TMP } from '../constants';
import { db } from '../db';
import { MigrationSource } from '../migrations';
import { Extension } from '../models/extension';
import { createSchemaIfNotExist } from './db-utils';
import {
  BadRequestException,
  InternalServerErrorException,
} from './http-exceptions';
import { logger } from './logger';
import { manifestSchema } from './manifest-schema';
import { createIsolate } from './utils';

export interface InstallRequired {
  publisherId: string;
  namespace: string;
  file: File;
}

export class ExtensionInstaller {
  public async install({ publisherId, namespace, file }: InstallRequired) {
    if (!file) {
      throw new BadRequestException({ message: 'File is required' });
    }

    await this.prepare();
    const { extTmpDir, extManifestTmpPath } = await this.extract(
      file,
      EXTENSIONS_TMP,
    );
    const source = await afs.readFile(extManifestTmpPath, 'utf-8');
    const legalManifest = await this.loadInstallManifest(source);
    const { packageName, version, name } = legalManifest;
    const extEntity = new Extension(namespace);

    await this.createRegistry(namespace);
    const extInfo = await extEntity.findByPackageName(packageName);

    if (Array.isArray(extInfo) && extInfo.length < 1) {
      const id = randomUUID();
      const extDir = resolve(EXTENSIONS_HOME, id);

      await afs.cp(extTmpDir, extDir, { recursive: true });
      await extEntity
        .create({
          id,
          name,
          path: extDir,
          manifest: legalManifest,
          publisherId,
          version,
          packageName,
        })
        .catch((error) => {
          logger.error(String(error));
          throw new InternalServerErrorException();
        });
      await afs.rm(extTmpDir, { recursive: true });
    } else {
      throw new BadRequestException({
        message: 'Extension already exists',
      });
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

  private async loadInstallManifest(source: string) {
    const { isolate, context } = await createIsolate({ memoryLimit: 16 });
    const module = await isolate.compileModule(source);

    await module.instantiate(context, (specifier, referer) => {
      return referer;
    });
    await module.evaluate();

    const defaultExport = await module.namespace.get('default', {
      copy: true,
    });
    const legalManifest = await this.validateManifestSchema(defaultExport);
    await isolate.dispose();

    return legalManifest;
  }

  private async extract(file: File, wehDir: string) {
    const extName = file.name.replace(extname(file.name), '');
    const extTmpDir = resolve(EXTENSIONS_TMP, extName);
    const extManifestTmpPath = resolve(extTmpDir, 'manifest.js');

    await new Promise((resolve) => {
      const nodeStream = Readable.fromWeb(file.stream());
      nodeStream
        .pipe(unzipper.Extract({ path: wehDir }))
        .on('error', async (error) => {
          logger.error(String(error));
          throw new BadRequestException({
            message: `Installer package ${file.name} is not available`,
          });
        })
        .on('finish', resolve);
    });

    return {
      extTmpDir,
      extManifestTmpPath,
    } as const;
  }

  private async validateManifestSchema(manifest: Manifest) {
    try {
      const m = await manifestSchema.parseAsync(manifest);
      return m;
    } catch (error) {
      logger.error(String(error));
      throw new BadRequestException({
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
    /* eslint-disable security/detect-non-literal-fs-filename*/
    const [err, s] = await did(afs.stat(EXTENSIONS_HOME));
    const [err1, s1] = await did(afs.stat(EXTENSIONS_TMP));

    if (err || !s.isDirectory()) {
      await afs.mkdir(EXTENSIONS_HOME, { recursive: true });
    }

    if (err1 || !s1.isDirectory()) {
      await afs.mkdir(EXTENSIONS_TMP, { recursive: true });
    }
    /* eslint-enable security/detect-non-literal-fs-filename*/
  }
}
