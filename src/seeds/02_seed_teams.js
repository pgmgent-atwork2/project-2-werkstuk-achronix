const tableName = "teams";
 
const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { name: "Ploeg 1",  },
    { name: "Ploeg 2",  },
  ]);
};
 
export { seed };