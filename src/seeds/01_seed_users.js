const tableName = "users";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      email: "admin@admin.com",
      firstname: "admin",
      lastname: "admin",
      password: "$2b$10$n16oFtT47azzzQKjsKQj9.qwDn5Tn9xLcK5bJKqZIVsAQjiNvPs4S",
      is_admin: true,
    },
    { 
      firstname: "John",
      lastname: "Doe",
      email: "user@example.com", 
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu", 
      is_admin: false,
    },
    { 
      firstname: "Jane",
      lastname: "Doe",
      email: "admin@example.com", 
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu", 
      is_admin: true
    }

  ]);
};

export { seed };
