const tableName = "shopping_cart";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("consumable_id").notNullable();
    table.integer("user_id").notNullable();
    table.integer("quantity").notNullable();
    table.decimal("price", 8, 2).notNullable();
    table.string("consumableName").notNullable();
    table.string("consumableImage");
    table.timestamp("created_at").defaultTo(knex.fn.now());

  
    table.foreign("consumable_id").references("consumables.id");
    table.foreign("user_id").references("users.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
