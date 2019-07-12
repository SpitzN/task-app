const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const Task = require("../../src/models/Task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "john",
  email: "john@example.com",
  password: "blue123!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "mike",
  email: "mike@example.com",
  password: "yellow987$",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: `first task from test`,
  completed: false,
  author: userOneId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: `second task from test`,
  completed: true,
  author: userOneId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: `third task from test`,
  completed: true,
  author: userTwoId
};

const configureTestDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  configureTestDB
};
