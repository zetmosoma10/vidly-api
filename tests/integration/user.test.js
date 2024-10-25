const request = require("supertest");
const mongoose = require("mongoose");
const _ = require("lodash");
const { User } = require("../../models/User.js");

describe("User", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/vidly_test");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  let adminToken, generalToken, allUsersInDb;

  beforeEach(async () => {
    server = require("../../server.js");

    await User.insertMany([
      {
        name: "test1",
        email: "test1@gmail.com",
        password: "123456",
        isAdmin: true,
      },
      {
        name: "test",
        email: "test@gmail.com",
        password: "123456",
      },
    ]);

    const adminUser = await User.findOne({ isAdmin: true });
    const generalUser = await User.findOne({ isAdmin: false });

    adminToken = adminUser.generateAuthToken();
    generalToken = generalUser.generateAuthToken();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  describe("getAllUsers", () => {
    it("should return all users in database if logged in user is admin", async () => {
      const res = await request(server)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
    });

    it("should return 403 if user is not admin", async () => {
      const res = await request(server)
        .get("/api/users")
        .set("Authorization", `Bearer ${generalToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Forbidden/i);
    });

    it("should return 401 if user is not logged in", async () => {
      const res = await request(server)
        .get("/api/users")
        .set("Authorization", `Bearer `);

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/No token provided/i);
    });
  });

  describe("createUser", () => {
    it("should save user to database and return 201 with JWT if user provide valid input data", async () => {
      const user = {
        name: "test",
        email: "test11@gmail.com",
        password: "123456",
        isAdmin: true,
      };

      const res = await request(server).post("/api/users").send(user);

      const userInDb = await User.findOne({ email: user.email });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(userInDb).not.toBeNull();
      expect(userInDb).toHaveProperty("_id", userInDb._id);
      expect(userInDb).toMatchObject(
        _.pick(userInDb, ["name", "email", "isAdmin"])
      );
    });

    it("should return 400 if user provide invalid inputs", async () => {
      const invalidUser = {
        name: "",
        email: "invalidemail",
        password: "123",
      };

      const res = await request(server).post("/api/users").send(invalidUser);

      expect(res.status).toBe(400);
    });

    it("should return 400 if email already exist", async () => {
      const res = await request(server).post("/api/users").send({
        name: "test1",
        email: "test1@gmail.com",
        password: "123456",
        isAdmin: true,
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/User already registered/i);
    });
  });
});
