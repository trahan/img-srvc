#! /bin/sh

/usr/src/app/node_modules/.bin/knex --knexfile /usr/src/app/db/knexfile.js migrate:latest
