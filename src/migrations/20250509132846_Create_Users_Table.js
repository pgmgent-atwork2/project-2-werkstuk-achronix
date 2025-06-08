const tableName = "users";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("firstname").notNullable();
    table.string("lastname").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("role_id").defaultTo(false);
    table.boolean("receive_notifications").defaultTo(true);

      table.foreign("role_id").references("roles.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
