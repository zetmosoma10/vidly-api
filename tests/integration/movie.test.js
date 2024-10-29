const mongoose = require("mongoose");
const request = require("supertest");
const { Movie } = require("../../models/Movie.js");
const { Genre } = require("../../models/Genre.js");
const { User } = require("../../models/User.js");

describe("/api/movies", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/vidly_test");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  let adminToken;
  let generalToken;

  beforeEach(async () => {
    server = require("../../server.js");

    await Movie.insertMany([
      {
        title: "title 1",
        numberInStock: 2,
        dailyRentalRate: 2.5,
        genre: {
          _id: new mongoose.Types.ObjectId(),
          genre: "genre1",
        },
      },
      {
        title: "title 2",
        numberInStock: 2,
        dailyRentalRate: 2.5,
        genre: {
          _id: new mongoose.Types.ObjectId(),
          genre: "genre2",
        },
      },
    ]);

    const adminUser = await User.create({
      name: "admin",
      email: "admin@gmail.com",
      password: "123456",
      isAdmin: true,
    });

    const generalUser = await User.create({
      name: "general",
      email: "general@gmail.com",
      password: "123456",
    });

    adminToken = adminUser.generateAuthToken();
    generalToken = generalUser.generateAuthToken();
  });

  afterEach(async () => {
    await Movie.deleteMany({});
    await Genre.deleteMany({});
    await User.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return 200 and all movies", async () => {
      const res = await request(server).get("/api/movies");

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.status).toMatch(/success/i);
      expect(res.body.data.movies[0]).toHaveProperty("_id");
      expect(res.body.data.movies[0]).toHaveProperty("title", "title 1");
    });
  });

  describe("GET /:id", () => {
    it("should return 200 and movie if valid objectId passed", async () => {
      const movie = await Movie.findOne({ title: "title 1" });

      const res = await request(server).get(`/api/movies/${movie._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toMatch(/success/i);
      expect(res.body.data.movie).toHaveProperty("_id");
      expect(res.body.data.movie).toHaveProperty("title", "title 1");
    });

    it("should return 400 and invalid objectId passed", async () => {
      const res = await request(server).get("/api/movies/1");

      expect(res.status).toBe(400);
    });

    it("should return 404 and No movie with given objectId", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/movies/${id}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/doesn't exist/i);
    });
  });

  describe("PATCH /:id", () => {
    it("should return 200 and updatedMovie if valid objectId passed", async () => {
      const movie = await Movie.findOne({ title: "title 1" });

      const res = await request(server)
        .patch(`/api/movies/${movie._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "testing" });

      expect(res.status).toBe(200);
      expect(res.body.status).toMatch(/success/i);
      expect(res.body.data.movie).toHaveProperty("_id");
      expect(res.body.data.movie).toHaveProperty("title", "testing");
    });

    it("should return 400 and invalid objectId passed", async () => {
      const res = await request(server)
        .patch("/api/movies/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.status).toMatch(/fail/i);
    });

    it("should return 404 and No movie with given objectId", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .patch(`/api/movies/${id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toMatch(/fail/i);
      expect(res.body.message).toMatch(/doesn't exist/i);
    });

    it("should return 401 if user not logged in", async () => {
      generalToken = "";
      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .patch(`/api/movies/${id}`)
        .set("Authorization", `Bearer ${generalToken}`);

      expect(res.status).toBe(401);
      expect(res.body.status).toMatch(/fail/i);
      expect(res.body.message).toMatch(/No token provided/i);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 200 and deletedMovie", async () => {
      const movie = await Movie.findOne({ title: "title 1" });

      const res = await request(server)
        .delete(`/api/movies/${movie._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      const deletedMovie = await Movie.findOne({ title: "title 1" });

      expect(res.status).toBe(200);
      expect(res.body.status).toMatch(/success/i);
      expect(deletedMovie).toBeNull();
      expect(res.body.data.deletedMovie).toHaveProperty("title", "title 1");
    });

    it("should return 400 invalid objectId passed", async () => {
      const res = await request(server)
        .delete("/api/movies/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
    });

    it("should return 404 no movie with given objectId", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .delete(`/api/movies/${id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/doesn't exist/i);
    });

    it("should return 401 if user not logged in", async () => {
      generalToken = "";
      const res = await request(server)
        .delete("/api/movies/1")
        .set("Authorization", `Bearer ${generalToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/No token provided/i);
    });

    it("should return 403 if user not admin", async () => {
      const res = await request(server)
        .delete("/api/movies/1")
        .set("Authorization", `Bearer ${generalToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Forbidden/i);
    });
  });

  describe("POST /", () => {
    it("should return 400 if invalid credentials passed", async () => {
      const genre = await Genre.create({ genre: "genre 1" });

      const res = await request(server)
        .post("/api/movies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "",
          genre: "1",
        });

      expect(res.status).toBe(400);
    });
  });
});
