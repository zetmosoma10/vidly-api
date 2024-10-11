const winston = require("winston");
const mongoLogger = require("../utils/mongoLogger");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    mongoLogger,
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exception.log" }),
  ],
});

module.exports = logger;
