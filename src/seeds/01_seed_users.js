const tableName = "users";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      email: "brecht.nuytinck@example.com",
      firstname: "BRECHT",
      lastname: "NUYTINCK",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "pieter.olieux@example.com",
      firstname: "PIETER",
      lastname: "OLIEUX",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "tom.hamerlinck@example.com",
      firstname: "TOM",
      lastname: "HAMERLINCK",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "kevin.vansante@example.com",
      firstname: "KEVIN",
      lastname: "VAN SANTE",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "leander.declercq@example.com",
      firstname: "LEANDER",
      lastname: "DE CLERCQ",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "ayco.neyt@example.com",
      firstname: "AYCO",
      lastname: "NEYT",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "marc.olieux@example.com",
      firstname: "MARC",
      lastname: "OLIEUX",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "guy.geldhof@example.com",
      firstname: "GUY",
      lastname: "GELDHOF",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "jeffrey.slagle@example.com",
      firstname: "JEFFREY",
      lastname: "SLAGLE",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "jente.vanhoucke@example.com",
      firstname: "JENTE",
      lastname: "VAN HOUCKE",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "bernard.vanschoonacker@example.com",
      firstname: "BERNARD",
      lastname: "VAN SCHOONACKER",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "marnix.deroo@example.com",
      firstname: "MARNIX",
      lastname: "DE ROO",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "gilbert.maegerman@example.com",
      firstname: "GILBERT",
      lastname: "MAEGERMAN",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "jitse.nuytinckdevogelaere@example.com",
      firstname: "JITSE",
      lastname: "NUYTINCK DE VOGELAERE",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "thomas.audenaert@example.com",
      firstname: "THOMAS",
      lastname: "AUDENAERT",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "ennio.buysse@example.com",
      firstname: "ENNIO",
      lastname: "BUYSSE",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "filip.desmet@example.com",
      firstname: "FILIP",
      lastname: "DE SMET",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "jeroen.monbalieu@example.com",
      firstname: "JEROEN",
      lastname: "MONBALIEU",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "redgy.vansante@example.com",
      firstname: "REDGY",
      lastname: "VAN SANTE",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
    {
      email: "anita.willems@example.com",
      firstname: "ANITA",
      lastname: "WILLEMS",
      password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9c4clXu",
      is_admin: false,
    },
  ]);
};

export { seed };
