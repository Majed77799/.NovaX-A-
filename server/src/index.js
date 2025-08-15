"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const path = require("path");

const config = require("./config");
const { createBaseLogger, createHttpLogger } = require("./logger");

const baseLogger = createBaseLogger();
const httpLogger = createHttpLogger(baseLogger);

const app = express();

// Behind reverse proxies (e.g., Vercel/NGINX), trust the first proxy to get real client IP
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Request size limits
app.use(express.json({ limit: config.requestJsonLimit }));
app.use(express.urlencoded({ extended: false, limit: config.requestUrlencodedLimit }));

// HTTP logger (minimal request/response metadata; no bodies)
app.use(httpLogger);

// CORS allowlist
const allowedOriginsSet = new Set(config.allowedOrigins);
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser clients
    if (allowedOriginsSet.has(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: false,
  optionsSuccessStatus: 204,
}));

function getClientToken(req) {
  const auth = req.headers["authorization"]; 
  if (auth && typeof auth === "string") {
    const parts = auth.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  }
  const apiKey = req.headers["x-api-key"]; 
  if (apiKey && typeof apiKey === "string") return apiKey;
  return null;
}

// Rate limiting: per IP
const ipLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxPerIp,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || (req.socket && req.socket.remoteAddress) || "unknown",
  message: "Too many requests from this IP, please try again later.",
});

// Rate limiting: per token (falls back to IP if token missing)
const tokenLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxPerToken,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const token = getClientToken(req);
    const ip = req.ip || (req.socket && req.socket.remoteAddress) || "unknown";
    return token ? `tok:${token}` : `ip:${ip}`;
  },
  message: "Too many requests for this token, please try again later.",
});

app.use(ipLimiter);
app.use(tokenLimiter);

// JWT verification with secret rotation support
function verifyJwtWithRotation(token) {
  if (!token) {
    const e = new Error("Missing token");
    e.status = 401;
    throw e;
  }
  const secrets = config.jwtSecrets;
  const errors = [];
  for (let i = 0; i < secrets.length; i += 1) {
    const secret = secrets[i];
    try {
      const decoded = jwt.verify(token, secret);
      if (i > 0) {
        baseLogger.warn({ usedSecretIndex: i }, "Token verified with a rotated (older) secret. Consider reissuing tokens.");
      }
      return decoded;
    } catch (err) {
      errors.push(err.message);
    }
  }
  const error = new Error("Invalid token");
  error.status = 401;
  error.details = errors;
  throw error;
}

function adminGuard(req, res, next) {
  try {
    const token = getClientToken(req);
    const payload = verifyJwtWithRotation(token);
    const claimValue = payload[config.adminRoleClaim];
    const isAdmin = Array.isArray(claimValue)
      ? claimValue.includes(config.adminRoleValue)
      : claimValue === config.adminRoleValue || payload.is_admin === true;
    if (!isAdmin) {
      const e = new Error("Forbidden: admin access required");
      e.status = 403;
      throw e;
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

// PII scrubbing utilities
const PII_KEYS = new Set([
  "password", "pass", "pwd", "secret", "token", "authorization", "cookie", "set-cookie",
  "email", "phone", "mobile", "ssn", "card", "cardNumber", "creditCard", "cvv",
]);

function isProbablyEmail(value) {
  return typeof value === "string" && /.+@.+\..+/.test(value);
}

function isProbablyCardNumber(value) {
  return typeof value === "string" && /\b\d{13,19}\b/.test(value.replace(/[-\s]/g, ""));
}

function redactString(value, opts = { keepLast: 4 }) {
  if (typeof value !== "string") return value;
  const keep = Math.max(0, Math.min(value.length, opts.keepLast || 0));
  const hidden = value.slice(0, Math.max(0, value.length - keep)).replace(/./g, "*");
  return hidden + value.slice(value.length - keep);
}

function scrubValue(value) {
  if (value == null) return value;
  if (typeof value === "string") {
    if (isProbablyEmail(value)) return "[REDACTED_EMAIL]";
    if (isProbablyCardNumber(value)) return redactString(value);
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => scrubValue(v));
  if (typeof value === "object") return scrubObject(value);
  return value;
}

function scrubObject(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (const [key, val] of Object.entries(obj)) {
    if (PII_KEYS.has(key)) {
      result[key] = "[REDACTED]";
      continue;
    }
    result[key] = scrubValue(val);
  }
  return result;
}

async function writeAuditEvent(eventType, details, req) {
  const entry = {
    ts: new Date().toISOString(),
    event: eventType,
    ip: (req && (req.ip || (req.socket && req.socket.remoteAddress))) || undefined,
    user: req && req.user ? { sub: req.user.sub, id: req.user.id, email: undefined } : undefined,
    path: req && req.originalUrl,
    method: req && req.method,
    details: scrubValue(details || {}),
  };
  await fs.ensureFile(config.auditLogFile);
  await fs.appendFile(config.auditLogFile, JSON.stringify(entry) + "\n", "utf8");
}

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, service: "secure-backend", env: config.nodeEnv });
});

// Purchases route (audit logging)
app.post("/purchases", async (req, res, next) => {
  try {
    // Placeholder business logic
    const purchase = {
      id: Date.now().toString(36),
      amount: req.body && req.body.amount,
      currency: req.body && req.body.currency,
    };

    await writeAuditEvent("purchase_created", { purchaseId: purchase.id, amount: purchase.amount }, req);

    res.status(201).json({ ok: true, purchase });
  } catch (err) {
    next(err);
  }
});

// Admin routes (protected by JWT admin guard)
app.get("/admin/reports", adminGuard, async (req, res, next) => {
  try {
    await writeAuditEvent("admin_reports_accessed", { by: req.user && (req.user.sub || req.user.id) }, req);
    res.json({ ok: true, message: "Admin reports available." });
  } catch (err) {
    next(err);
  }
});

// Internal crash-report endpoint (for clients to report errors to OUR backend)
app.post("/internal/crash-report", async (req, res, next) => {
  try {
    const payload = scrubValue(req.body || {});
    const file = path.join(config.crashReportsDir, `${new Date().toISOString().slice(0, 10)}.jsonl`);
    await fs.ensureFile(file);
    await fs.appendFile(file, JSON.stringify({ ts: new Date().toISOString(), ...payload }) + "\n", "utf8");
    res.status(202).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Centralized error handler
// Note: Do not leak internal errors to clients; log minimal info
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) {
    baseLogger.error({ err: { message: err.message, stack: err.stack } }, "Unhandled error");
  }
  res.status(status).json({ ok: false, error: status >= 500 ? "Internal Server Error" : err.message });
});

// Process-level crash logging to our own logs
process.on("uncaughtException", (err) => {
  baseLogger.fatal({ err: { message: err.message, stack: err.stack } }, "Uncaught exception");
  // Optionally, exit(1) after logging depending on your process manager strategy
});

process.on("unhandledRejection", (reason) => {
  baseLogger.fatal({ err: reason }, "Unhandled promise rejection");
});

app.listen(config.port, () => {
  baseLogger.info({ port: config.port, env: config.nodeEnv, allowedOrigins: config.allowedOrigins }, "Secure backend started");
});