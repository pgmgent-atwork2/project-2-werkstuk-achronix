const tableName = "password_resets";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      user_id: 1,
      token: "token",
      created_at: new Date(),
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    },
  ]);
};

export { seed };
