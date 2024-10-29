const mongoose = require("mongoose");
const request = require("supertest");
const { Customer } = require("../../models/Customer.js");

describe("/api/customers", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/vidly_test");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    server = require("../../server.js");

    await Customer.insertMany([
      { name: "name1", phone: "0912233103" },
      { name: "name2", phone: "07283945331", isGold: true },
    ]);
  });

  afterEach(async () => {
    await Customer.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return 200 and all customers", async () => {
      const res = await request(server).get("/api/customers");

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
      expect(
        res.body.data.customers.some((c) => c.name === "name1")
      ).toBeTruthy();
      expect(
        res.body.data.customers.some((c) => c.name === "name2")
      ).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return 200 and customer if given valid objectId", async () => {
      const customer = await Customer.findOne({ name: "name1" });

      const res = await request(server).get(`/api/customers/${customer._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.customer).toHaveProperty("_id");
      expect(res.body.data.customer).toHaveProperty("name", customer.name);
    });

    it("should return 400 if invalid objectId is passed", async () => {
      const res = await request(server).get("/api/customers/1");

      expect(res.status).toBe(400);
    });

    it("should return 404 if there's no customer with given objectId", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/customers/${id}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not exist/i);
    });
  });

  describe("PATCH /:id", () => {
    it("should return 200 and updatedCustomer if given valid objectId", async () => {
      const customer = await Customer.findOne({ name: "name1" });
      const newName = "testing";

      const res = await request(server)
        .patch(`/api/customers/${customer._id}`)
        .send({ name: newName });

      expect(res.status).toBe(200);
      expect(res.body.data.customer).toHaveProperty("_id");
      expect(res.body.data.customer).toHaveProperty("name", newName);
    });

    it("should return 400 if invalid objectId is passed", async () => {
      const res = await request(server).patch("/api/customers/1");

      expect(res.status).toBe(400);
    });

    it("should return 404 if there's no customer with given objectId", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).patch(`/api/customers/${id}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not exist/i);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 200 and deletedCustomer if given valid objectId", async () => {
      const customer = await Customer.findOne({ name: "name1" });

      const res = await request(server).delete(
        `/api/customers/${customer._id}`
      );

      const deletedCustomer = await Customer.findOne({ _id: customer._id });

      expect(res.status).toBe(200);
      expect(deletedCustomer).toBeNull();
      expect(res.body.data.customer).toHaveProperty("_id");
      expect(res.body.data.customer).toHaveProperty("name", customer.name);
    });

    it("should return 400 if invalid objectId is passed", async () => {
      const res = await request(server).delete("/api/customers/1");

      expect(res.status).toBe(400);
    });

    it("should return 404 if there's no customer with given objectId", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).delete(`/api/customers/${id}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not exist/i);
    });
  });

  describe("POST /", () => {
    it("should return 201 and newly created customer", async () => {
      const res = await request(server)
        .post("/api/customers")
        .send({ name: "update", phone: "0123456789", isGold: true });

      expect(res.status).toBe(201);
      expect(res.body.data.customer).toHaveProperty("_id");
      expect(res.body.data.customer).toHaveProperty("name", "update");
    });

    it("should return 400 when given name less than 3 characters", async () => {
      const res = await request(server)
        .post("/api/customers")
        .send({ name: "up", phone: "" });

      expect(res.status).toBe(400);
    });

    it("should return 400 when given name more than 50 characters", async () => {
      const res = await request(server)
        .post("/api/customers")
        .send({ name: "u".repeat(51), phone: "" });

      expect(res.status).toBe(400);
    });
  });
});
