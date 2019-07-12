const request = require("supertest");
const Task = require("../src/models/Task");
const app = require("../src/app");
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  configureTestDB
} = require("./fixtures/db");

beforeEach(configureTestDB);

/* ----------------------------------------- Create ----------------------------------------- */

test(`should create task for authenticated user`, async () => {
  const response = await request(app)
    .post(`/tasks`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: `new task from my test`
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test(`Should not create task with invalid description`, async () => {
  const response = await request(app)
    .post(`/tasks`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: ``
    })
    .expect(400);
  const task = await Task.findById(response.body._id);
  expect(task).toBeNull();
});

/* ----------------------------------------- Read ----------------------------------------- */

test(`should fetch all tasks for authenticated user`, async () => {
  const response = await request(app)
    .get(`/tasks`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test(`Should fetch authenticated user task by task id`, async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test(`Should not fetch user task by id if unauthenticated`, async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);
});

test(`Should not fetch other users task by id`, async () => {
  const response = await request(app)
    .get(`/tasks/${taskThree._id}`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(500);
});

test(`Should fetch only completed tasks`, async () => {
  const response = await request(app)
    .get(`/tasks?completed=true`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body[0].completed).toEqual(true);
});

test(`Should fetch only incomplete tasks`, async () => {
  const response = await request(app)
    .get(`/tasks?completed=false`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body[0].completed).toEqual(false);
});

test(`Should sort tasks by description in a descending order`, async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=description:desc`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  console.log(response.body);
});

/* ----------------------------------------- Update ----------------------------------------- */

test(`Should not update other users task`, async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: `this task should not be updated`
    })
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task.description).not.toBe(`this task should not be updated`);
});

/* ----------------------------------------- Delete ----------------------------------------- */
test(`Should delete authenticated user task`, async () => {
  const response = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  const task = await Task.findById(taskThree._id);
  expect(task).toBeNull();
});

test(`Should not delete task if unauthenticated`, async () => {
  const response = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .send()
    .expect(401);
  const task = await Task.findById(taskThree._id);
  expect(task).not.toBeNull();
});

test(`should not delete other user tasks`, async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
