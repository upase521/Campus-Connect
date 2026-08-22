import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Notification.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

router.post("/", async (req, res) => {
  const notif = await Notification.create(req.body);
  res.json({ success: true, data: notif });
});

export default router;