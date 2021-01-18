import { FastifyInstance, FastifyRequest } from "fastify";
const parser: FastifyInstance = require("fastify");

parser.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  (request: FastifyRequest, body: string, done: any) => {
    try {
      const json = JSON.parse(body);
      done(null, json);
    } catch (error) {
      error.statusCode = 400;
      done(error, undefined);
    }
  }
);

module.exports = parser;
