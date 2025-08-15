"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, "public")));

// In-app feedback endpoint
app.post("/api/feedback", async (req, res) => {
  try {
    const { email, message } = req.body || {};

    const messageText = typeof message === "string" ? message.trim() : "";
    const emailText = typeof email === "string" ? email.trim() : "";

    if (!messageText) {
      return res.status(400).json({ ok: false, error: "Message is required" });
    }

    const record = {
      timestamp: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
      userAgent: req.headers["user-agent"] || "",
      email: emailText,
      message: messageText,
    };

    const dataDir = path.join(__dirname, "data");
    const filePath = path.join(dataDir, "feedback.jsonl");
    await fsp.mkdir(dataDir, { recursive: true });
    await fsp.appendFile(filePath, JSON.stringify(record) + "\n", "utf8");

    return res.json({ ok: true });
  } catch (error) {
    console.error("/api/feedback error:", error);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});