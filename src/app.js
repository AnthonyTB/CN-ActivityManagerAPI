require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const app = express();
const morganOption = NODE_ENV === "production" ? "tiny" : "common";
const activityRouter = require("./Routers/activity-router");
const accountRouter = require("./Routers/account-router");
const authRouter = require("./Auth/Auth-Router");

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express());

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.use("/api/activities", activityRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/auth", authRouter);

app.get("/api/", (req, res) => {
  res.send("Hello, world!");
});

module.exports = app;
