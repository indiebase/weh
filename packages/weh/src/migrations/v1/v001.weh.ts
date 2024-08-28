import { WehTables } from '@indiebase/weh-sdk/weh-tables';
import { type Knex } from 'knex';

import { KnexSchemaEx } from '../utils';

export const v001_weh = async function (
  schema: string,
): Promise<Knex.Migration> {
  return {
    async up(knex: Knex): Promise<void> {
      const knexExSchema = new KnexSchemaEx(knex).withSchema(schema);
      await knexExSchema.initBuiltinFuncs();

      knexExSchema.schema
        .createTable(WehTables.extensions, (table) => {
          table.uuid('id', { primaryKey: true }).notNullable();
          table.string('name').notNullable();
          table.string('version').notNullable();
          table.string('path').notNullable();
          table.string('package_name').notNullable();
          table.json('manifest').notNullable();
          table.string('publisher_id').notNullable();
          table.timestamps(true, true);
        })
        .then(async () => {
          await knexExSchema.createUpdatedAtTrigger(WehTables.extensions);
        });
    },
    async down(knex: Knex) {
      for (const tableName in WehTables) {
        await knex.schema.withSchema(schema).dropTable(tableName);
      }
    },
  };
};
