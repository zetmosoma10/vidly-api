const mongoose = require("mongoose");
const moment = require("moment");
const request = require("supertest");
const { Rental } = require("../../models/Rentals.js");
const { User } = require("../../models/User.js");
const { Movie } = require("../../models/Movie.js");

describe("/api/returns", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/vidly_test");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  let customerId;
  let movieId;
  let rental;
  let movie;
  let adminToken;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../server.js");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    movie = await Movie.create({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { genre: "12345" },
      numberInStock: 10,
    });

    rental = await Rental.create({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    const adminUser = await User.create({
      name: "admin",
      email: "admin@gmail.com",
      password: "123456",
      isAdmin: true,
    });

    adminToken = adminUser.generateAuthToken();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await User.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    adminToken = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for customer/movie", async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if we have valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the returnDate if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should set the rentalFee if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return rental if input is valid", async () => {
    const res = await exec();

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
