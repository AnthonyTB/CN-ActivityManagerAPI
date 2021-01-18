import { FastifyReply } from "fastify";
require("dotenv").config();
const cors = require("cors");
const { NODE_ENV } = require("./config");
const server = require("fastify")({ logger: true });
const activityRouter = require("./Routers/activity-router");
const accountRouter = require("./Routers/account-router");
const authRouter = require("./Auth/Auth-Router");
const { PORT } = require("./config");

server.use(cors());

server.use(function errorHandler(error: Error, reply: FastifyReply) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  reply.status(500).send(response);
});

const missingFromBody = (list: Object, reply: FastifyReply) => {
  for (const [key, value] of Object.entries(list))
    if (value == null)
      return reply.status(400).send({
        error: `Missing '${key}' in request body`,
      });
};

server.use("/api/activities", activityRouter);
server.use("/api/accounts", accountRouter);
server.use("/api/auth", authRouter);

server.get("/api/", (reply: FastifyReply) => {
  reply.send("Hello, world!");
});

server.listen(PORT, () => {
  server.log.info(`Server listening at http://localhost:${PORT}`);
});

(module.exports = server), missingFromBody;
