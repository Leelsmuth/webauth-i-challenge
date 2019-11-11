const express = require("express");

const usersRouter = require("./users/users-router");

const server = express();

server.use(express.json());
server.use("/", usersRouter);

server.get("/", (req, res) => {
  res.send("<h3>DB Helpers with knex</h3>");
});

module.exports = server;
