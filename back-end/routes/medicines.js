import express from "express";
import pool from "../db.js";
import { allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM medicines ORDER BY medicine_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", allowRoles("Admin", "Pharmacist"), async (req, res) => {
  const { name, category, batch_number, expiry_date, price, quantity } = req.body;

  if (!name || !category || !batch_number || !expiry_date || price == null || quantity == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO medicines (name, category, batch_number, expiry_date, price, quantity)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, category, batch_number, expiry_date, Number(price), Number(quantity)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", allowRoles("Admin", "Pharmacist"), async (req, res) => {
  const { name, category, batch_number, expiry_date, price, quantity } = req.body;

  if (!name || !category || !batch_number || !expiry_date || price == null || quantity == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE medicines
       SET name=$1, category=$2, batch_number=$3, expiry_date=$4, price=$5, quantity=$6
       WHERE medicine_id=$7
       RETURNING *`,
      [name, category, batch_number, expiry_date, Number(price), Number(quantity), Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", allowRoles("Admin", "Pharmacist"), async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM medicines WHERE medicine_id=$1",
      [Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
