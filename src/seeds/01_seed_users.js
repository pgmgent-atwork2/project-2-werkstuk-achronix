const tableName = "users";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      email: "admin@admin.com",
      firstname: "admin",
      lastname: "admin",
      password: "$2b$10$n16oFtT47azzzQKjsKQj9.qwDn5Tn9xLcK5bJKqZIVsAQjiNvPs4S",
      is_admin: true,
      receive_notifications: false,
    },
    {
      email: "user@user.com",
      firstname: "user",
      lastname: "user",
      password: "$2b$10$n16oFtT47azzzQKjsKQj9.qwDn5Tn9xLcK5bJKqZIVsAQjiNvPs4S",
      is_admin: false,
      receive_notifications: true,
    },
    {
      firstname: "John",
      lastname: "Pork",
      email: "john.pork@gmail.com",
      password: "$2b$10$n16oFtT47azzzQKjsKQj9.qwDn5Tn9xLcK5bJKqZIVsAQjiNvPs4S",
      is_admin: false,
      receive_notifications: false,
    },
    {
      firstname: "Tim",
      lastname: "Cheese",
      email: "tim.cheese@gmail.com",
      password: "$2b$10$n16oFtT47azzzQKjsKQj9.qwDn5Tn9xLcK5bJKqZIVsAQjiNvPs4S",
      is_admin: true,
      receive_notifications: true,
    },
  ]);
};

export { seed };
