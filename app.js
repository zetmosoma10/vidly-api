const express = require("express");

const app = express();

app.use(express.json());

const genres = [
  { id: 1, genre: "Sci-fi" },
  { id: 2, genre: "Drama" },
  { id: 3, genre: "Horror" },
  { id: 4, genre: "Action" },
];

app.get("/api/genres", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      genres,
    },
  });
});

app.listen(3000, () => {
  console.log("Server started at port 3000...");
});
