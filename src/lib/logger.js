import winston from "winston";

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), logFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
