import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../Controlles/notificationController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const NotificationRouter = express.Router();

// كل مسارات الإشعارات شخصية بالكامل — محتاجة تسجيل دخول دايمًا
NotificationRouter.use(verifyToken);

NotificationRouter.get("/", getNotifications);
NotificationRouter.get("/unread-count", getUnreadCount);
NotificationRouter.put("/read-all", markAllAsRead);
NotificationRouter.put("/:id/read", markAsRead);
NotificationRouter.delete("/:id", deleteNotification);

export default NotificationRouter;