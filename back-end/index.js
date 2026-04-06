// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import medicineRoutes from "./routes/medicines.js";
import supplierRoutes from "./routes/suppliers.js";
import saleRoutes from "./routes/sales.js";
import authRoutes from "./routes/auth.js";
import { initDb } from "./dbInit.js";
import { authRequired } from "./middleware/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", authRequired, userRoutes);
app.use("/api/medicines", authRequired, medicineRoutes);
app.use("/api/suppliers", authRequired, supplierRoutes);
app.use("/api/sales", authRequired, saleRoutes);

app.get("/api/health", (_, res) => {
  res.json({ ok: true, message: "API is running" });
});

const PORT = process.env.PORT || 5000;
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err.message);
    process.exit(1);
  });

/*
CORS is a security feature in browsers that blocks requests between different origins unless explicitly allowed.
👉 Example:
Frontend: http://localhost:3000
Backend: http://localhost:5000
These are different origins, so the browser will block requests unless CORS is enabled.
*/