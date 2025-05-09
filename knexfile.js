import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DATABASE_NAME || "database.sqlite3";

const config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: `./${dbName}`, 
    },
    useNullAsDefault: true,
    migrations: {
      tableName: "knex_migrations", 
      directory: "./src/migrations", 
      stub: "./migration.stub", 
    },
    seeds: {
      directory: "./src/seeds", 
      stub: "./seed.stub", 
    },
  },
};

export default config;
