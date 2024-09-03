import { ExtensionInstaller, InstallRequired } from '../helper';

export const extService = {
  async install(options: InstallRequired) {
    const installer = new ExtensionInstaller();
    await installer.install(options);
  },
};
