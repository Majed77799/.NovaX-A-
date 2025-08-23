"use strict";

const path = require("path");
const fs = require("fs-extra");
const dotenv = require("dotenv");

dotenv.config();

function getListEnv(name, defaultValue) {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") return Array.isArray(defaultValue) ? defaultValue : (defaultValue ? String(defaultValue).split(",") : []);
  return raw.split(",").map((v) => v.trim()).filter(Boolean);
}

function getNumberEnv(name, defaultValue) {
  const raw = process.env[name];
  if (!raw) return defaultValue;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

function getStringEnv(name, defaultValue) {
  const raw = process.env[name];
  return raw && raw.length > 0 ? raw : defaultValue;
}

const rootDir = path.resolve(__dirname, "..");

const config = {
  nodeEnv: getStringEnv("NODE_ENV", "development"),
  isProduction: getStringEnv("NODE_ENV", "development") === "production",
  port: getNumberEnv("PORT", 4000),

  jwtSecrets: getListEnv("JWT_SECRETS", ["devsecret-current", "devsecret-previous"]),

  allowedOrigins: getListEnv("CORS_ALLOWED_ORIGINS", [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://yourapp.vercel.app"
  ]),

  rateLimitWindowMs: getNumberEnv("RATE_LIMIT_WINDOW_MS", 60_000),
  rateLimitMaxPerIp: getNumberEnv("RATE_LIMIT_MAX_PER_IP", 100),
  rateLimitMaxPerToken: getNumberEnv("RATE_LIMIT_MAX_PER_TOKEN", 300),

  requestJsonLimit: getStringEnv("REQUEST_JSON_LIMIT", "100kb"),
  requestUrlencodedLimit: getStringEnv("REQUEST_URLENCODED_LIMIT", "50kb"),

  logDir: path.resolve(rootDir, getStringEnv("LOG_DIR", "./logs")),
  auditLogFile: path.resolve(rootDir, getStringEnv("AUDIT_LOG_FILE", "./logs/audit.log")),
  crashReportsDir: path.resolve(rootDir, getStringEnv("CRASH_REPORTS_DIR", "./logs/crash-reports")),

  adminRoleClaim: getStringEnv("ADMIN_ROLE_CLAIM", "role"),
  adminRoleValue: getStringEnv("ADMIN_ROLE_VALUE", "admin"),
};

fs.ensureDirSync(config.logDir);
fs.ensureDirSync(config.crashReportsDir);

module.exports = config;