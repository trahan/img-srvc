
exports.up = function(knex, Promise) {
  return knex.schema.createTable('files', function (table) {
    table.increments();
    table.string('name');
    table.string('s3uri');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('files');
};
