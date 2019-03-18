// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'img-srvc',
      host: 'docker.for.mac.host.internal',
      user: 'devuser',
      password: 'password'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'img-srvc',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
