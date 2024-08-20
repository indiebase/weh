import { Knex } from 'knex';

/**
 * Create organization template tables
 *
 * @param schema
 * @returns
 */
export const v001_weh_seed = async function (
  schema: string,
): Promise<Knex.Migration> {
  return {
    async up(knex: Knex): Promise<void> {
      const knexSchema = knex.withSchema(schema);
    },
    async down() {},
  };
};
