const tableName = "order_items";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("order_id").notNullable();
    table.integer("consumable_id").notNullable();
    table.integer("quantity").notNullable();
    table.decimal("price", 8, 2).notNullable();

    table.foreign("order_id").references("orders.id").onDelete("CASCADE");
    table.foreign("consumable_id").references("consumables.id");

    table.index("order_id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
