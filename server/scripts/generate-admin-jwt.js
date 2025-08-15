"use strict";

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const config = require("../src/config");

function main() {
  const secrets = config.jwtSecrets;
  if (!secrets || secrets.length === 0) {
    console.error("No JWT_SECRETS configured in environment");
    process.exit(1);
  }
  const primarySecret = secrets[0];
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "admin-user-1",
    [config.adminRoleClaim]: config.adminRoleValue,
    iat: nowSec,
    exp: nowSec + 60 * 60, // 1 hour
  };
  const token = jwt.sign(payload, primarySecret, { algorithm: "HS256" });
  process.stdout.write(token + "\n");
}

main();