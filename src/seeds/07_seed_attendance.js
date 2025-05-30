const tableName = "attendance";

const seed = async function (knex) {
  await knex(tableName).truncate();
};

export { seed };
