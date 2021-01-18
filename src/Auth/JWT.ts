import { FastifyReply } from "fastify";
import { IUser } from "../interfaces";
const authService = require("./AuthService");

const requireAuth = (request: any, reply: FastifyReply, done: any) => {
  const authToken = request.headers.authorization || "";
  let bearerToken;
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return reply.status(401).send({ error: "Missing bearer token" });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }
  try {
    const payload = authService.verifyJwt(bearerToken);
    authService
      .getUserWithUserName(server.get("db"), payload.sub)
      .then((user: IUser) => {
        if (!user)
          return reply.status(401).send({ error: "Unauthorized request" });
        request.user = user;
        done();
      })
      .catch((err: Error) => {
        console.error(err);
        done(err, undefined);
      });
  } catch (error) {
    reply.status(401).send({ error: "Unauthorized request" });
  }
};

module.exports = requireAuth;
