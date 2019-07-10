const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const multer = require("multer");

router.post(`/users`, async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.genAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post(`/users/login`, async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.genAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post(`/users/logout`, auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post(`/users/logoutall`, auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  dest: "avatars/",
  limits: { fileSize: 2000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("please upload .jpg or .png or .jpeg image type "));
    }
    cb(undefined, true);
  }
});

router.post(
  `/users/profile/avatar`,
  auth,
  upload.single("avatar"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get(`/users/profile`, auth, async (req, res) => {
  res.send(req.user);
});

router.patch(`/users/profile`, auth, async (req, res) => {
  const _id = req.user._id;
  const updates = Object.keys(req.body);
  const allowedUpdatesArray = ["name", "email", "password", "age"];
  const isValidOps = updates.every(update =>
    allowedUpdatesArray.includes(update)
  );

  if (!isValidOps) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete(`/users/profile`, auth, async (req, res) => {
  try {
    const user = req.user;
    await user.remove();

    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
