require("dotenv").config();
const cors = require("cors");
const { NODE_ENV } = require("./config");
const fastify = require("fastify")({ logger: true });
const activityRouter = require("./Routers/activity-router");
const accountRouter = require("./Routers/account-router");
const authRouter = require("./Auth/Auth-Router");

fastify.use(cors());
fastify.use(express());

fastify.use(function errorHandler(error, reply) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  reply.status(500).json(response);
});

fastify.use("/api/activities", activityRouter);
fastify.use("/api/accounts", accountRouter);
fastify.use("/api/auth", authRouter);

app.get("/api/", (reply) => {
  reply.send("Hello, world!");
});

module.exports = app;
