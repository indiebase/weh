import { type Knex } from 'knex';

import { v001_weh } from './v1/v001.weh';

export class MigrationSource implements Knex.MigrationSource<any> {
  #schema = 'public';

  constructor(schema: string) {
    this.#schema = schema;
  }

  // Must return a Promise containing a list of migrations.
  // Migrations can be whatever you want, they will be passed as
  // arguments to getMigrationName and getMigration
  getMigrations() {
    // In this run we are just returning migration names
    return Promise.resolve(['v001_weh']);
  }

  getMigrationName(migration: any) {
    return migration;
  }

  async getMigration(migration: any): Promise<any> {
    switch (migration) {
      case 'v001_weh':
        return v001_weh(this.#schema);
      default:
        throw new Error(`${migration} migration not found`);
    }
  }
}
