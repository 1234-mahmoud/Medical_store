import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { userId: user.userId, username: user.username, role: user.role },
    process.env.JWT_SECRET || "dev_secret_change_me",
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res) => {
  const { username, password, role = "Cashier" } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  try {
    const exists = await pool.query(
      "SELECT userid FROM users WHERE username = $1",
      [username]
    );
    if (exists.rowCount > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING userid AS "userId", username, role',
      [username, hashed, role]
    );

    const user = result.rows[0];
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const safeUser = {
      userId: user.userid,
      username: user.username,
      role: user.role,
    };
    const token = signToken(safeUser);
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: token missing" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
    res.json({
      user: {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
      },
    });
  } catch {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
});

export default router;
