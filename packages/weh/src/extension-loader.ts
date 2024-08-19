import { promises as afs } from 'node:fs';
import { request } from 'node:http';
import { extname, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { did } from '@deskbtm/gadgets/did';
import { Manifest } from '@indiebase/weh-edk';
import { HTTPException } from 'hono/http-exception';
import unzipper from 'unzipper';

import { EXTENSIONS_HOME } from './constants';
import { importScript } from './helper';
import { logger } from './helper/logger';
import { manifestSchema } from './manifest-schema';

// abstract class ExtensionLoaderLifecycle {
//   /**
//    * Security checkup.
//    */
//   abstract checkup(code: string): void;

//   abstract manifest(): void;
// }

export class ExtensionLoader {
  public async installFromLocal(path: string) {
    const directory = await unzipper.Open.file(path);
    const dir = await this.prepareHome();
    await directory.extract({ path: dir });
  }

  public async installFromWebStream(file: File) {
    if (!file) {
      throw new HTTPException(400, { message: 'File is required' });
    }

    const wehDir = await this.prepareHome();
    const extDir = resolve(wehDir, file.name.replace(extname(file.name), ''));
    console.log(extDir);
    const extManifestPath = resolve(extDir, 'manifest.js');

    await this.extract(file, wehDir, extDir);
    const manifest = await importScript(extManifestPath);
    const legalManifest = await this.validateManifest(manifest);
    const { packageName, version } = legalManifest;
    await afs.rename(extDir, resolve(wehDir, `${packageName}@${version}`));
  }

  private async extract(file: File, wehDir: string, extDir: string) {
    return new Promise((resolve) => {
      const nodeStream = Readable.fromWeb(file.stream());
      nodeStream
        .pipe(unzipper.Extract({ path: wehDir }))
        .on('error', async (error) => {
          logger.error(error);
          // await afs.rm(extDir, { recursive: true, force: true });
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

  public async installFromMemory(req: Request) {
    // const directory = await unzipper.Open.buffer();
    // const dir = await this.#prepareHome();
    // await directory.extract({ path: dir });
  }

  public async installFromRemote(req: Request) {
    const directory = await unzipper.Open.url(request({}), '');
    // const dir = await this.#prepareHome();
    // await directory.extract({ path: dir });
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
