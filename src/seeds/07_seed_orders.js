const tableName = "orders";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      quantity: 2,
      price: "5.00",
      status: "NOT_PAID",
      consumable_id: 1,
      user_id: 1,
      order_on: new Date().toISOString(),
    },
    {
      quantity: 3,
      price: "7.50",
      status: "NOT_PAID",
      consumable_id: 2,
      user_id: 2,
      order_on: new Date().toISOString(),
    },
  ]);
};

export { seed };
