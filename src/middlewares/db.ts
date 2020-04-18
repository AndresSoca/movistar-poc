/**
 * Using config object instead of knexfile approach
 * in favor of 12-factor config methodology
 */

// this is working better than import
const knex = require('Knex')({
  client: process.env.DB_CLIENT || 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_DATABASE || 'mi_movistar',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
});
// this is working better than import
const bookshelf = require('Bookshelf')(knex);

export { knex, bookshelf };