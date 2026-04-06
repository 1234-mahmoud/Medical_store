import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";
import { allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT userid AS "userId", username, role FROM users ORDER BY userid ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", allowRoles("Admin"), async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: "username, password, and role are required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING userid AS "userId", username, role',
      [username, hashed, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", allowRoles("Admin"), async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({ message: "username and role are required" });
  }

  try {
    const numericId = Number(id);
    let query;
    let values;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query =
        'UPDATE users SET username=$1, password=$2, role=$3 WHERE userid=$4 RETURNING userid AS "userId", username, role';
      values = [username, hashed, role, numericId];
    } else {
      query =
        'UPDATE users SET username=$1, role=$2 WHERE userid=$3 RETURNING userid AS "userId", username, role';
      values = [username, role, numericId];
    }

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", allowRoles("Admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM users WHERE userid=$1", [Number(id)]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;