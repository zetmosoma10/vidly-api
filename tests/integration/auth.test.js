const request = require("supertest");
const { Genre } = require("../../models/Genre.js");
const { User } = require("../../models/User.js");
const mongoose = require("mongoose");

describe("auth Middleware", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/vidly_test");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  let user;
  let token;

  beforeEach(async () => {
    server = require("../../server.js");

    const uniqueEmail = `test${Math.random()
      .toString(36)
      .substr(2, 5)}@gmail.com`;

    user = await User.create({
      name: "admin",
      email: uniqueEmail,
      password: "123456",
      isAdmin: true,
    });

    token = user.generateAuthToken();
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await User.deleteMany({});
    await server.close();
  });

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("Authorization", `Bearer ${token}`)
      .send({ genre: "genre1" });
  };

  describe("auth.authProctect", () => {
    it("should return 200 if token is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(201);
    });

    it("should return 401 if token is not passed", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/No token provided/i);
    });

    it("should return 400 if token is not a valid", async () => {
      token = "a";

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Invalid token/i);
    });

    it("should return 404 if token is not a valid", async () => {
      await User.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/User not found/i);
    });
  });

  describe("auth.authRestrict", () => {
    it("should return 403 if user is not admin", async () => {
      user.isAdmin = false;
      await user.save();
      token = user.generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Forbidden/i);
    });

    it("should return 201 if user is admin", async () => {
      const res = await exec();

      expect(res.status).toBe(201);
    });
  });
});
