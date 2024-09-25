const genres = [
  { id: 1, genre: "Sci-fi" },
  { id: 2, genre: "Drama" },
  { id: 3, genre: "Horror" },
  { id: 4, genre: "Action" },
];

exports.getGenres = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      genres,
    },
  });
};

exports.getGenre = (req, res) => {
  const { id } = req.params;
  const genre = genres.find((g) => g.id === parseInt(id));

  if (!genre) {
    res.status(404).json({
      status: "fail",
      message: "Genre with that ID does not exist.",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      genre,
    },
  });
};
