// Update with your config settings.

module.exports = {
  // the values should come from env variables
  development: {
    client: "postgresql",
    connection: {
      host: 'postgres',
      database: "mi_movistar",
      user: "postgres",
      password: "postgres"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
  // you can add more environments here
};
