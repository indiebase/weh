import { Knex } from 'knex';

export async function hasSchema(knex: Knex, schema: string) {
  const schemas = await knex
    .select('*')
    .from('information_schema.schemata')
    .where('schema_name', schema);
  return schemas.length > 0;
}

export async function createSchemaIfNotExist(knex: Knex, schema: string) {
  if (!(await hasSchema(knex, schema))) {
    return knex.schema.createSchema(schema);
  }
}
