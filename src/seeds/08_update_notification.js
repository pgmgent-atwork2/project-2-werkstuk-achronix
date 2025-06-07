export const seed = async function (knex) {
  await knex("users").update({ receive_notifications: true });
};
