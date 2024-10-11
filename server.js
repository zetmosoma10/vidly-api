require("dotenv").config({ path: "./.env" });
const app = require("./app");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

process.on("uncaughtException", (error) => {
  logger.error(error.message, { stack: error.stack });
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error(error.message, { stack: error.stack });
  process.exit(1);
});

// * CONNECT TO Database
mongoose.connect(process.env.DB_CONN_STR).then(() => {
  logger.info("Db connection successfull...");
});

// ? START THE SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server started at port ${port}...`);
});
