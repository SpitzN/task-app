const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/task-app",
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
  error => {
    console.log(`DB connected`);
  }
);
