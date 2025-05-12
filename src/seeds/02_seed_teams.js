const tableName = "teams";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([{ name: "A" }, { name: "B" }, { name: "C" }]);
};

export { seed };
