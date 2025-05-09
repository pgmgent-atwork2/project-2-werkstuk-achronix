const tableName = "users";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      email: "user@example.com",
      firstname: "John",
      lastname: "Doe",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "admin@example.com",
      firstname: "Jane",
      lastname: "Doe",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: true,
    },
  ]);
};

export { seed };
