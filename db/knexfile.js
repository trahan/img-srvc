// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'ImgSrvc',
      host: 'docker.for.mac.host.internal',
      user: 'devuser',
      password: 'password'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'ImgSrvc',
      host: 'td15iw91rl59899.ccjpzh7c5a6x.us-east-2.rds.amazonaws.com',
      user:     'mtrahan',
      password: '6NzywYtrwdZd'
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
