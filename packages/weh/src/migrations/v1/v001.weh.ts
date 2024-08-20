import { Knex } from 'knex';

import { WehTables } from '../tables';
import { KnexSchemaEx } from '../utils';

export const v001_weh = async function (
  schema: string,
): Promise<Knex.Migration> {
  return {
    async up(knex: Knex): Promise<void> {
      const knexEx = new KnexSchemaEx(knex);
      const knexExSchema = await knexEx.withSchema(schema).initBuiltinFuncs();

      knexExSchema
        .createTable(WehTables.extensions, (table) => {
          table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
          table.string('name').notNullable();
          table.string('path').notNullable();
          table.json('manifest').notNullable();
          table.timestamps(true, true);
        })
        .then(async () => {
          await knexExSchema.createUpdatedAtTrigger(WehTables.extensions);
        });
    },
    async down(knex: Knex) {
      // for (const tableName in MgrTables) {
      //   await knex.schema.withSchema(schema).dropTable(tableName);
      // }
    },
  };
};
