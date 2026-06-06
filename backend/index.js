import express from "express";
import cors from "cors";
import ordersRouter from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/orders", ordersRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "PharmaLink backend is running." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`PharmaLink backend listening on http://localhost:${PORT}`);
});
