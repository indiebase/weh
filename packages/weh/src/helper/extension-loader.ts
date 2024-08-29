export class ExtensionLoader {
  constructor() {
    this.loadExtensions();
  }

  private async loadExtensions() {
    // const extensions = import.meta.glob('./extensions/*.ts', { eager: true });
    // for (const [path, extension] of Object.entries(extensions)) {
    //   console.log(path, extension);
    // }
  }
}
