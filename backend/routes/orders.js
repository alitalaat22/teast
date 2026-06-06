import { Router } from "express";
// استيراد موديل الـ Mongoose الخاص بالطلبات من مجلد database
import Order from "../orders.js"; 

const router = Router();

// 1. جلب جميع الطلبات أو تصفيتها حسب الحالة من قاعدة البيانات
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // إذا أرسل الفرونت اند حالة معينة (مثل delivered)، قم بالفلترة بناءً عليها
    if (status && status !== "all") {
      query.status = status;
    }

    // جلب البيانات الحقيقية من MongoDB باستخدام الموديل
    const orders = await Order.find(query);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. جلب طلب واحد محدد بواسطة الـ ID الخاص به من قاعدة البيانات
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;