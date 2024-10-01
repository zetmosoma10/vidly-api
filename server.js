require("dotenv").config({ path: "./.env" });
const app = require("./app");
const mongoose = require("mongoose");

// * CONNECT TO Database
mongoose
  .connect(process.env.DB_CONN_STR)
  .then(() => {
    console.log("Db connection successfull...");
  })
  .catch((err) => {
    console.log("Db connection Failed!...");
    console.log(err);
  });

// ? START THE SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}...`);
});
