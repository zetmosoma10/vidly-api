const request = require("supertest");
const { Genre } = require("../../models/Genre.js");
const { User } = require("../../models/User.js");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
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

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { genre: "Action" },
        { genre: "Comedy" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.data.genres.length).toBe(2);
      expect(
        res.body.data.genres.some((g) => g.genre === "Action")
      ).toBeTruthy();
      expect(
        res.body.data.genres.some((g) => g.genre === "Comedy")
      ).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre if given valid objectId", async () => {
      const genre = await Genre.create({ genre: "Action" });

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.genre).toHaveProperty("_id");
      expect(res.body.data.genre).toHaveProperty("genre", genre.genre);
    });

    it("should return 404 if genre with given id does not exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let genre;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("Authorization", `Bearer ${token}`)
        .send({ genre });
    };

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/No token provided/i);
    });

    it("should return 403 if user is not admin", async () => {
      const user = await User.create({
        name: "test",
        email: "test@gmail.com",
        password: "123456",
      });

      token = user.generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Forbidden/i);
    });

    it("should return status 400 if genre is less than 5 characters", async () => {
      genre = "A";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // it("should return 400 if genre already exist", async () => {
    //   await Genre.create({ genre: "Action" });
    //   genre = "Action";

    //   const res = await exec();

    //   expect(res.status).toBe(400);
    // });

    it("should return status 400 if genre is more than 50 characters", async () => {
      genre = "A".repeat(51);

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save genre when valid genre passed", async () => {
      genre = "Sci-fi";

      const res = await exec();

      const newGenre = await Genre.findOne({ genre });

      expect(res.status).toBe(201);
      expect(newGenre).not.toBeNull();
      expect(newGenre).toHaveProperty("genre", newGenre.genre);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete genre in database if valid objectId is passed", async () => {
      const genre = await Genre.create({ genre: "genre1" });

      const res = await request(server)
        .delete(`/api/genres/${genre._id}`)
        .set("Authorization", `Bearer ${token}`);

      const deletedGenre = await Genre.findOne({ genre: "genre1" });

      expect(res.status).toBe(204);
      expect(deletedGenre).toBeNull();
    });

    it("should return 404 if  genre with given objectId does not exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .delete(`/api/genres/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 400 if  invalid objectId is passed", async () => {
      const res = await request(server)
        .delete("/api/genres/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("should return 401 if user not logged in", async () => {
      const genre = await Genre.create({ genre: "genre1" });
      token = "";

      const res = await request(server)
        .delete(`/api/genres/${genre._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/No token provided/i);
    });

    it("should return 403 if user not logged in", async () => {
      const user = await User.create({
        name: "test",
        email: "test@gmail.com",
        password: "123456",
      });
      token = user.generateAuthToken();

      const genre = await Genre.create({ genre: "genre1" });

      const res = await request(server)
        .delete(`/api/genres/${genre._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Forbidden/i);
    });
  });
});
