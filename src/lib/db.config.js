import knex from "knex";

if (!process.env.DB_HOST) {
  throw new Error("DB_HOST is not defined");
}

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
  },
  pool: {
    min: 0,
    max: 3,
  },
});

export default db;
