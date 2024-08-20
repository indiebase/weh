import { WehTables } from '@indiebase/weh-sdk/weh-tables';

import { db } from '../db';

export interface ExtensionProps {
  id?: string;
  name?: string;
  path?: string;
  packageName?: string;
  manifest?: Record<string, any>;
}

export class Extension {
  constructor(private readonly schema: string) {}

  public create(props: ExtensionProps) {
    const { name, path, packageName, manifest } = props;
    return db
      .withSchema(this.schema)
      .insert({ name, path, packageName, manifest })
      .into(WehTables.extensions);
  }

  public findByPackageName(packageName: string) {
    return db
      .withSchema(this.schema)
      .select('*')
      .where('package_name', packageName)
      .from(WehTables.extensions);
  }

  public update(props: ExtensionProps) {
    const { name, path, manifest, packageName } = props;
    return db
      .withSchema(this.schema)
      .where('package_name', packageName)
      .update({ name, path, manifest, packageName })
      .into(WehTables.extensions);
  }
}
