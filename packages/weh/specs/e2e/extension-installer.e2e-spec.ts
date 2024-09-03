import { ExtensionInstaller } from '../../src/helper/extension-installer';
import { beforeAll, describe } from 'vitest';

describe('Extension Installer (e2e)', () => {
  let installer: ExtensionInstaller;
  beforeAll(() => {
    installer = new ExtensionInstaller();
  });
});
