const express = require("express");
require("./db/mongoose");
const path = require("path");
const usersRouter = require("./routes/api/users");
const tasksRouter = require("./routes/api/tasks");

const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

module.exports = app;
