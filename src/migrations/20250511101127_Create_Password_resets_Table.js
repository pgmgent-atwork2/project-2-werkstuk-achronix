const tableName = "password_resets";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("token").notNullable();
    table.timestamp("created_at");
    table.timestamp("expires_at");

    table.foreign("user_id").references("users.id").onDelete("cascade");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
