const tableName = "consumables";
 
const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { 
      name: "Ping Pong Balls (Pack of 6)", 
      description: "Premium quality 3-star ping pong balls for competitive play",
      price: 8.99,
      image_url: "/images/consumables/ping-pong-balls.jpg",
      category_id: 1
    },
    { 
      name: "Table Tennis Paddle", 
      description: "Professional grade paddle with ergonomic grip",
      price: 24.99,
      image_url: "/images/consumables/paddle.jpg",
      category_id: 2
    }
  ]);
};
 
export { seed };