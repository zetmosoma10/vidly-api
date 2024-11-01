require("dotenv").config({ path: "./.env" });
const app = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (error) => {
  console.log(error.message, { stack: error.stack });
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log(error.message, { stack: error.stack });
  process.exit(1);
});

// * CONNECT TO Database
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.DB_CONN_STR).then(() => {
    console.log(`Connected to Datbase...`);
  });
}
// ? START THE SERVER
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server started at port ${port}...`);
});

module.exports = server;
