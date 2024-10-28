const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/User.js");

describe("/api/auth", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/vidly_test");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /", () => {
    let email, password;

    beforeEach(async () => {
      server = require("../../server.js");

      email = "testuser@gmail.com";
      password = "123456";

      await User.create({
        name: "test",
        email,
        password,
      });
    });

    afterEach(async () => {
      await User.deleteMany({});
      await server.close();
    });

    it("should return 200 and a token if valid credentials are provided", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email, password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.status).toMatch(/success/i);
    });

    it("should return 400 if invalid credentials are provided", async () => {
      email = "invalidEmail";
      password = "1";

      const res = await request(server)
        .post("/api/auth")
        .send({ email, password });

      expect(res.status).toBe(400);
    });

    it("should return 400 if EMAIL does not Exist", async () => {
      email = "john@gmail.com";

      const res = await request(server)
        .post("/api/auth")
        .send({ email, password });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });

    it("should return 400 if PASSWORD does not Match one In Database", async () => {
      password = "abcdef";

      const res = await request(server)
        .post("/api/auth")
        .send({ email, password });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });
  });
});
