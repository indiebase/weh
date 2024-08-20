import { ExtensionLoader } from '../helper';

export const extService = {
  async install(namespace: string, file: File) {
    const loader = new ExtensionLoader();
    await loader.installFromWebStream(namespace, file);
  },
};
