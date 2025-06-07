const tableName = "order_items";

const seed = async function (knex) {
  await knex(tableName).truncate();
};

export { seed };
