"use strict";

const pino = require("pino");
const pinoHttp = require("pino-http");

const SENSITIVE_PATHS = [
  "req.headers.authorization",
  "req.headers.cookie",
  "req.headers[\"x-api-key\"]",
  "res.headers[\"set-cookie\"]",
  "password",
  "token",
  "secret",
  "apiKey",
  "creditCard.number",
  "card.number",
  "ssn",
  "email",
  "phone",
];

function createBaseLogger() {
  return pino({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
    redact: {
      paths: SENSITIVE_PATHS,
      remove: true,
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

function createHttpLogger(baseLogger) {
  return pinoHttp({
    logger: baseLogger,
    redact: SENSITIVE_PATHS,
    customProps() {
      return {
        service: "secure-backend",
      };
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          remoteAddress: req.socket && req.socket.remoteAddress,
          userAgent: req.headers && req.headers["user-agent"],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  });
}

module.exports = {
  createBaseLogger,
  createHttpLogger,
};