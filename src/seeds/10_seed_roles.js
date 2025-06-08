const tableName = "roles";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([{ name: "admin" }, { name: "user" }, { name: "guest" }]);
};

export { seed };
