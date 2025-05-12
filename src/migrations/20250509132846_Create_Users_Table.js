const tableName = "users";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("firstname").notNullable();
    table.string("lastname").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("is_admin").defaultTo(false);
    table.boolean("receive_notifications").defaultTo(true);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
