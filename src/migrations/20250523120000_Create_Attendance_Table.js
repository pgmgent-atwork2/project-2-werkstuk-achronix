/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("attendance", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("match_id").unsigned().notNullable();
    table.string("status", 255).defaultTo("unknown");
    table.string("is_selected", 255).defaultTo("not_selected");

    // Foreign keys
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("match_id")
      .references("id")
      .inTable("matches")
      .onDelete("CASCADE");

    // Composite unique constraint to prevent duplicate attendance records
    table.unique(["user_id", "match_id"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("attendance");
}
