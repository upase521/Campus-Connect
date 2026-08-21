import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    audience: String,
    channel: String,
    kind: String,
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);