const tableName = "emails";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("email").notNullable();
    table.string("subject").notNullable();
    table.text("content").notNullable();
    table.boolean("is_sent").notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
