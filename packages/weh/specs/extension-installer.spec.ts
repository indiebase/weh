import '@deskbtm/gadgets';

import { promises as pfs } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

import { ExtensionInstaller } from '../src/helper/extension-installer';

describe('Extension Installer', () => {
  let installer: ExtensionInstaller;
  let manifestSrc: string;
  beforeAll(async () => {
    installer = new ExtensionInstaller();
    manifestSrc = (
      await pfs.readFile(resolve(import.meta.dirname, './assets/manifest.js'))
    ).toString('utf-8');
  });

  it('load extension manifest', async () => {
    const manifest = installer['loadInstallManifest'](manifestSrc);
    expect(manifest).toBeTypeOf('object');
  });

  // it('success:manifest schema validation', async () => {
  //   await installer['validateManifestSchema'](manifest);
  // });

  // it('fail:manifest schema validation', async () => {
  //   try {
  //     await installer['validateManifest'](illegalManifest);
  //   } catch (error: any) {
  //     expect(error.status).toBe(400);
  //   }
  // });
});
