import knex from 'knex';

export const pg = knex({
  client: 'pg',
  connection: {
    host: 'api-dev.indiebase.deskbtm.com',
    port: 5432,
    user: 'postgres',
    database: 'indiebase-dev',
    password: 'dev@indiebase.com',
  },
});
