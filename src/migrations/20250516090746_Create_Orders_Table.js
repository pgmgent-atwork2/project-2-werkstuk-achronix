const tableName = "orders";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("quantity").notNullable();
    table.string("price").notNullable();
    table.string("status").notNullable();
    table.integer("consumable_id");
    table.integer("user_id");
    table.timestamp("order_on");
    
    table.foreign("consumable_id").references("consumables.id");
    table.foreign("user_id").references("users.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
