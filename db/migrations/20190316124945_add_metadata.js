
exports.up = function(knex, Promise) {
  return knex.schema.table('files', function (table) {
    table.renameColumn('s3uri', 's3_key');
    table.string('content_type');
    table.integer('size');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('files', function (table) {
  	table.renameColumn('s3_key', 's3uri');
  	table.dropColumn('content_type');
  	table.dropColumn('size');
  })
};
