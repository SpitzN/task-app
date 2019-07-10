const express = require('express')
require("./db/mongoose");
const path = require("path");
const usersRouter = require("./routes/api/users");
const tasksRouter = require("./routes/api/tasks");
const config = require("config");

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => console.log(`server running on ${port}`));
