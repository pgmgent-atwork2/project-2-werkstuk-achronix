const tableName = "users";
 
const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { 
      username: "user", 
      email: "user@example.com", 
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu", 
      is_admin: false,
    },
    { 
      username: "admin", 
      email: "admin@example.com", 
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu", 
      is_admin: true
    }
  ]);
};
 
export { seed };