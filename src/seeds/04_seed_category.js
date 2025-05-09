const tableName = "categories";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([{ name: "drinks" }, { name: "food" }]);
};

export { seed };
