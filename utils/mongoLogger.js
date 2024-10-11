const winston = require("winston");
require("winston-mongodb");

const mongoLogger = new winston.transports.MongoDB({
  level: "error", // Log only errors
  db: process.env.DB_CONN_STR,
  collection: "application_logs",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  expireAfterSeconds: 604800,
});

module.exports = mongoLogger;
