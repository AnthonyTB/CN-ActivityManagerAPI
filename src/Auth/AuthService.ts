const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  getUserWithUserName(db: any, username: string) {
    return db("users").where({ username }).first();
  },
  comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject: string, payload: string | Buffer | object) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: "HS256",
    });
  },
  verifyJwt(token: string) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  },
  parseBasicToken(token: string) {
    return Buffer.from(token, "base64").toString().split(":");
  },
};

module.exports = AuthService;
