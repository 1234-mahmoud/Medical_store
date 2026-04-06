import express from "express";
import pool from "../db.js";
import { allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales ORDER BY sale_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", allowRoles("Admin"), async (req, res) => {
  const { customer_name, date, total_amount } = req.body;
  if (!customer_name || !date || total_amount == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO sales (customer_name, date, total_amount) VALUES ($1, $2, $3) RETURNING *",
      [customer_name, date, Number(total_amount)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", allowRoles("Admin"), async (req, res) => {
  const { customer_name, date, total_amount } = req.body;
  if (!customer_name || !date || total_amount == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE sales SET customer_name=$1, date=$2, total_amount=$3 WHERE sale_id=$4 RETURNING *",
      [customer_name, date, Number(total_amount), Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", allowRoles("Admin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM sales WHERE sale_id=$1", [
      Number(req.params.id),
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
