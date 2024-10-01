const express = require("express");
const genresRoutes = require("./routes/genresRoutes");

const app = express();

app.use(express.json());
app.use("/api/genres", genresRoutes);

module.exports = app;
