import winston from "winston";
import "winston-mongodb";
import config from "../../config/index.js";

const customTime = winston.format((data) => {
  const date = new Date();
  data.timestamp = date.toLocaleString("en-GB", {
    timeZone: "Asia/Tashkent",
    hour12: false,
  });

  return data;
});

const logger = winston.createLogger({
  transports: [
    // File'ga log qilish
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/comibned.log" }),
    new winston.transports.File({ filename: "logs/info.log", level: "info" }),

    // DB logs
    new winston.transports.MongoDB({
      db: config.MONGO_URI,
      collection: "errorLogs",
      level: "error",
    }),
  ],

  format: winston.format.combine(customTime(), winston.format.json()),
});

export default logger;
