const server = require("./app");
const { DATABASE_URL } = require("./config");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
});

server.set("db", db);
