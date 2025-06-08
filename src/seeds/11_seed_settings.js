const tableName = "settings";

const seed = async function (knex) {
  const existingSetting = await knex(tableName)
    .where("key", "spending_limit_per_order")
    .first();

  if (!existingSetting) {
    await knex(tableName).insert([
      {
        key: "spending_limit_per_order",
        value: "50.00",
      },
    ]);
  }
};

export { seed };
