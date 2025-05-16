const tableName = "consumables";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.double("price").notNullable();
    table.string("image_url");
    table.integer("category_id").notNullable();

    table.foreign("category_id").references("categories.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
