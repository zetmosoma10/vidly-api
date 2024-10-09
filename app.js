const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const morgan = require("morgan");
const genresRoutes = require("./routes/genresRoutes");
const customerRoutes = require("./routes/customerRoutes");
const moviesRoutes = require("./routes/moviesRoutes");
const rentalsRoutes = require("./routes/rentalsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const catchAllRoutes = require("./middleware/catchAllRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/genres", genresRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.all("*", catchAllRoutes);
app.use(errorMiddleware);

module.exports = app;
