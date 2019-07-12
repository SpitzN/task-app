const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const { userOneId, userOne, configureTestDB } = require("./fixtures/db");

beforeEach(configureTestDB);

test(`should signup a new user`, async () => {
  const response = await request(app)
    .post(`/users`)
    .send({
      name: `andy spear`,
      email: `andy@example.com`,
      password: `test123`
    })
    .expect(201);
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      name: `andy spear`,
      email: `andy@example.com`
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe(`test123`);
});

test(`should login existing user`, async () => {
  const response = await request(app)
    .post(`/users/login`)
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test(`should not login non-existing user - incorrect password`, async () => {
  await request(app)
    .post(`/users/login`)
    .send({
      email: userOne.email,
      password: `red1234`
    })
    .expect(400);
});

test(`should not login non-existing user - incorrect email`, async () => {
  await request(app)
    .post(`/users/login`)
    .send({
      email: `john@bad-example.com`,
      password: userOne.password
    })
    .expect(400);
});

test(`should get user profile using auth`, async () => {
  await request(app)
    .get(`/users/profile`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test(`should not get profile if not auth user`, async () => {
  await request(app)
    .get(`/users/profile`)
    .send()
    .expect(401);
});

test(`should delete account for auth user`, async () => {
  await request(app)
    .delete(`/users/profile`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test(`should not delete account for un-auth user`, async () => {
  await request(app)
    .delete(`/users/profile`)
    .send()
    .expect(401);
});

test(`should upload avatar image`, async () => {
  await request(app)
    .post(`/users/profile/avatar`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test(`shuold update valid user fields`, async () => {
  await request(app)
    .patch(`/users/profile`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: `andrew`
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toEqual(`andrew`);
});

test(`should not update invalid fields`, async () => {
  await request(app)
    .patch(`/users/profile`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send({
      loaction: `New-York`
    })
    .expect(400);
});
