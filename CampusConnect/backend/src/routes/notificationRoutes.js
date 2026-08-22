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

// Mark all notifications as read
router.patch("/read-all", async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark notifications as read" });
  }
});

// Mark a single notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true } },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, data: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark notification as read" });
  }
});

export default router;