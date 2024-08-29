import { WehTables } from '@indiebase/weh-sdk/weh-tables';

import { db } from '../db';

export interface ExtensionProps {
  id?: string;
  name?: string;
  path?: string;
  publisherId?: string;
  packageName?: string;
  version?: string;
  manifest?: Record<string, any>;
}

export class Extension {
  constructor(private readonly schema: string) {}

  public create(props: ExtensionProps) {
    const { id, name, path, packageName, manifest, publisherId, version } =
      props;
    return db
      .withSchema(this.schema)
      .insert({ id, name, path, packageName, manifest, publisherId, version })
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
    const { name, path, manifest, packageName, version, publisherId } = props;
    return db
      .withSchema(this.schema)
      .where('package_name', packageName)
      .update({ name, path, manifest, packageName, version, publisherId })
      .into(WehTables.extensions);
  }
}
