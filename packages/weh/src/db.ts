import knex, { Knex } from 'knex';

export let db: Knex;

export function createConnection() {
  db = knex({
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
    },
    debug: kDevMode,
  });
}
