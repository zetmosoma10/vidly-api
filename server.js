require("dotenv").config({ path: "./.env" });
const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_CONN_STR)
  .then(() => {
    console.log("Db connection successfull...");
  })
  .catch((err) => {
    console.log("Db connection Failed!...");
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}...`);
});
