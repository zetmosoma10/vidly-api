const express = require("express");
const genresRoutes = require("./routes/genresRoutes");

const app = express();

app.use(express.json());
app.use("/api/genres", genresRoutes);

app.listen(3000, () => {
  console.log("Server started at port 3000...");
});
