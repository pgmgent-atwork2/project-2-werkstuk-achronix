const tableName = "notification";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("consumable_id").unsigned().nullable(); 
    table.string("title").notNullable();
    table.text("message").notNullable();
    table.string("type").defaultTo("back_in_stock");
    table.boolean("is_read").defaultTo(false);
    table.timestamps(true, true);

    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table
      .foreign("consumable_id")
      .references("consumables.id")
      .onDelete("CASCADE");

    table.index(["user_id", "is_read"]);
    table.index(["consumable_id"]);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
