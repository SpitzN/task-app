const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");
const auth = require("../../middleware/auth");

router.post(`/tasks`, auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    author: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /tasks?completed=true -> get back the ones already done
// GET /tasks?limit=10&skip=0 -> customize how to use pagination
// GET /tasks?sortBy=createdAt:desc

router.get(`/tasks`, auth, async (req, res) => {
  const match = {};
  const completed = req.query.completed;
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const sortBy = req.query.sortBy;
  const sort = {};

  if (completed) {
    match.completed = completed === "true";
  }

  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit,
          skip,
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get(`/tasks/:id`, auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, author: req.user._id });

    if (!task) {
      return res.status(404).send(error);
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch(`/tasks/:id`, auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdatesArray = ["description", "completed"];
  const isValidOps = updates.every(update =>
    allowedUpdatesArray.includes(update)
  );
  if (!isValidOps) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    const task = await Task.findOne({ _id, author: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete(`/tasks/:id`, auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, author: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
