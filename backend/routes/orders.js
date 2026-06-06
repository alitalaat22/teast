import { Router } from "express";

const ordersSeed = [
  {
    id: 1,
    pharmacy: "Al-Shifa Pharmacy",
    date: "16 May 2026",
    amount: "$28.75",
    status: "delivered",
    progress: 100,
    icon: "check",
  },
  {
    id: 2,
    pharmacy: "City Care Pharmacy",
    date: "16 May 2026",
    amount: "$15.50",
    status: "processing",
    progress: 60,
    icon: "truck",
  },
  {
    id: 3,
    pharmacy: "Al-Shifa Pharmacy",
    date: "16 May 2026",
    amount: "$43.24",
    status: "pending",
    progress: 15,
    icon: "clock",
  },
  {
    id: 4,
    pharmacy: "Noor Medical Center",
    date: "16 May 2026",
    amount: "$8.50",
    status: "delivered",
    progress: 100,
    icon: "check",
  },
  {
    id: 5,
    pharmacy: "Al-Shifa Pharmacy",
    date: "16 May 2026",
    amount: "$12.50",
    status: "cancelled",
    progress: 0,
    icon: "x",
  },
];

const router = Router();

router.get("/", (req, res) => {
  const { status } = req.query;
  if (status && status !== "all") {
    return res.json(ordersSeed.filter((order) => order.status === status));
  }
  res.json(ordersSeed);
});

router.get("/:id", (req, res) => {
  const order = ordersSeed.find((item) => item.id === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ error: "Order not found." });
  }
  res.json(order);
});

export default router;
