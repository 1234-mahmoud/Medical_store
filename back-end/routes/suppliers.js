import express from "express";
import pool from "../db.js";
import { allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM suppliers ORDER BY supplier_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", allowRoles("Admin"), async (req, res) => {
  const { name, contact, address } = req.body;
  if (!name || !contact || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO suppliers (name, contact, address) VALUES ($1, $2, $3) RETURNING *",
      [name, contact, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", allowRoles("Admin"), async (req, res) => {
  const { name, contact, address } = req.body;
  if (!name || !contact || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE suppliers SET name=$1, contact=$2, address=$3 WHERE supplier_id=$4 RETURNING *",
      [name, contact, address, Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", allowRoles("Admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM suppliers WHERE supplier_id=$1",
      [Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
