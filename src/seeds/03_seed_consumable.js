const tableName = "consumables";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      name: "Coca-Cola",
      price: 2.5,
      stock: 100,
      image_url: "/uploads/consumables/cola.png",
      category_id: 1,
    },
    {
      name: "Cola-Zero",
      price: 2.5,
      stock: 100,
      image_url: "/uploads/consumables/cocacolazero.png",
      category_id: 1,
    },
     {
      name: "Ice Tea",
      price: 2.5,
      stock: 100,
      image_url: "/uploads/consumables/icetea.png",
      category_id: 1,
    },
     {
      name: "Aquarius",
      price: 3.5,
      stock: 100,
      image_url: "/uploads/consumables/aquarius.jpg",
      category_id: 1,
    },
      {
      name: "Jupiler",
      price: 2.5,
      stock: 100,
      image_url: "/uploads/consumables/jupiler.png",
      category_id: 1,
    },
    {
      name: "lays zout",
      price: 1.5,
      stock: 25,
      image_url: "/uploads/consumables/layszout.webp",
      category_id: 2,
    },
    {
      name: "lays paprika",
      price: 1.5,
      stock: 50,
      image_url: "/uploads/consumables/paprika.jpg",
      category_id: 2,
    },
     {
      name: "lays bolognaise",
      price: 1.5,
      stock: 50,
      image_url: "/uploads/consumables/bolognaise.jpg",
      category_id: 2,
    },
     {
      name: "lays ketchup",
      price: 1.5,
      stock: 50,
      image_url: "/uploads/consumables/ketchup.png",
      category_id: 2,
    },
     {
      name: "grills",
      price: 1.5,
      stock: 50,
      image_url: "/uploads/consumables/grills.jpg",
      category_id: 2,
    },
  ]);
};

export { seed };
