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

test(`should create task for user`, async () => {
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

test(`should get all tasks for auth user`, async () => {
  const response = await request(app)
    .get(`/tasks`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test(`should not delete other user tasks`, async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(500);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
