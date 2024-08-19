import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

import { ExtensionLoader } from '../src/extension-loader';
import illegalManifest from './assets/illegal-manifest.js';
import manifest from './assets/manifest.js';

describe('Extension loader', () => {
  let extensionLoader: ExtensionLoader;
  beforeAll(() => {
    extensionLoader = new ExtensionLoader();
  });

  it('install', async () => {
    await extensionLoader.installFromLocal(
      resolve(import.meta.dirname, './assets/sample.weh'),
    );
  });

  it('success:manifest schema validation', async () => {
    await extensionLoader['validateManifest'](manifest);
  });

  it('fail:manifest schema validation', async () => {
    try {
      await extensionLoader['validateManifest'](illegalManifest);
    } catch (error: any) {
      expect(error.status).toBe(400);
    }
  });
});
