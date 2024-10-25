const mongoose = require("mongoose");
const { User } = require("../../../models/User.js");
const { getCurrentUser } = require("../../../controllers/usersController.js");

describe("User", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/vidly_test");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  let currentUser;

  beforeEach(async () => {
    server = require("../../../server.js");

    currentUser = await User.create({
      name: "admin",
      email: "admin@gmail.com",
      password: "123456",
      isAdmin: true,
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  describe("GetCurrentUser", () => {
    it("should return current user if logged in", async () => {
      const req = {
        user: currentUser,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await getCurrentUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          user: expect.objectContaining({
            name: currentUser.name,
            email: currentUser.email,
            isAdmin: currentUser.isAdmin,
          }),
        },
      });

      // Verify omitted fields
      const userData = res.json.mock.calls[0][0].data.user;
      expect(userData).not.toHaveProperty("password");
      expect(userData).not.toHaveProperty("updatedAt");
      expect(userData).not.toHaveProperty("__v");
      expect(userData).not.toHaveProperty("_id");
    });
  });
});
