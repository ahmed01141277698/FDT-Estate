import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  markAsSeen,
  deleteNotification,
} from "../Controlles/notificationController.js";
import { streamNotifications } from "../Controlles/sseController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const NotificationRouter = express.Router();

// SSE: EventSource في المتصفح مبيقدرش يبعت custom headers، فمش نقدر نحطها
// خلف verifyToken العادي (اللي بيدوّر على Authorization header). التحقق
// من الهوية هنا بيحصل يدويًا جوه streamNotifications نفسها (توكن كـ
// query param). عشان كده لازم تتسجّل قبل سطر .use(verifyToken) تحت.
NotificationRouter.get("/stream", streamNotifications);

// باقي المسارات شخصية بالكامل — محتاجة تسجيل دخول عادي بالـ header
NotificationRouter.use(verifyToken);

NotificationRouter.get("/", getNotifications);
NotificationRouter.get("/unread-count", getUnreadCount);
NotificationRouter.put("/read-all", markAllAsRead);
NotificationRouter.put("/:id/read", markAsRead);
NotificationRouter.put("/:id/seen", markAsSeen);
NotificationRouter.delete("/:id", deleteNotification);

export default NotificationRouter;