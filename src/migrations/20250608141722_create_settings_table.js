const tableName = "settings";
 
export function up(knex) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments('id').primary();
        table.text('key').notNullable().unique();
        table.text('value').notNullable();
    });
}
 
export function down(knex) {
    return knex.schema.dropTable(tableName);
}