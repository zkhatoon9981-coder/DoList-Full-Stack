require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./src/routes/auth");
const taskRoutes = require("./src/routes/tasks");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  "/api/auth/send-otp",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      message: "Too many OTP requests. Please wait 10 minutes and try again.",
    },
  }),
);

app.use(
  "/api/auth/verify-otp",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      message: "Too many verification attempts. Please wait and try again.",
    },
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Please check the submitted values.",
    });
  }

  res.status(err.status || 500).json({
    message:
      err.status && err.status < 500
        ? err.message
        : "Something went wrong on the server.",
  });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error(
      "Missing MONGODB_URI. Copy .env.example to .env and configure it.",
    );
    process.exit(1);
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error(
      "JWT_SECRET must be set to a secret of at least 32 characters in .env.",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    app.listen(PORT, () => {
      console.log(`DoList is running at http://localhost:${PORT}`);
      console.log("Keep this terminal open while using the app.");
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

start();
