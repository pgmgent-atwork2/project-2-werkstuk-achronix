const tableName = "consumables";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      name: "Coca-Cola",
      price: 2.5,
      stock: 100,
      image_url: "/images/consumables/coca.jpg",
      category_id: 1,
    },
    {
      name: "lays zout",
      price: 24.99,
      stock: 0,
      image_url: "/images/consumables/lays-zoud.jpg",
      category_id: 2,
    },
  ]);
};

export { seed };
