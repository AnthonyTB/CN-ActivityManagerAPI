import { FastifyReply, FastifyRequest, RequestBodyDefault } from "fastify";
import { IUser } from "../interfaces";

const authRouter = require("fastify");
const authService = require("./AuthService");
const parser = require("../bodyParser");
const { missingFromBody, server } = require("../server");

authRouter.post(
  "/login",
  (
    request: FastifyRequest,
    body: RequestBodyDefault,
    reply: FastifyReply,
    done: any
  ) => {
    const parsedBody = parser(request, body);
    const { username, password } = parsedBody;
    const loginUser = { username, password };

    missingFromBody(loginUser, reply);

    authService
      .getUserWithUserName(server.get("db"), loginUser.username)
      .then((dbUser: IUser) => {
        if (!dbUser)
          return reply.status(400).send({
            error: "No such user",
          });

        return authService
          .comparePasswords(loginUser.password, dbUser.password)
          .then((compareMatch: string) => {
            if (!compareMatch)
              return reply.status(400).send({
                error: "Incorrect password",
              });
            const sub = dbUser.username;
            const payload = { user_id: dbUser.id };
            reply.send({
              authToken: authService.createJwt(sub, payload),
            });
          });
      })
      .catch(done());
  }
);

module.exports = authRouter;
