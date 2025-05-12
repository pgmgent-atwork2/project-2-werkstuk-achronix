const tableName = "matches";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.date("date").notNullable();
    table.string("location").notNullable();
    table.enum("home_away", ["THUIS", "UIT"]).notNullable();
    table.integer("team_id").unsigned();

    table.foreign("team_id").references("teams.id").onDelete("set null");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
