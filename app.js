const express = require("express");
const morgan = require("morgan");
const genresRoutes = require("./routes/genresRoutes");
const customerRoutes = require("./routes/customerRoutes");
const app = express();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/genres", genresRoutes);
app.use("/api/customers", customerRoutes);

module.exports = app;
