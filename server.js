const express = require("express");
require("./server/db/mongoose");
const path = require("path");
const usersRouter = require("./server/routes/api/users");
const tasksRouter = require("./server/routes/api/tasks");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => console.log(`server running on ${port}`));
