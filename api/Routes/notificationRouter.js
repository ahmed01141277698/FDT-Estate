import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  markAsSeen,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  deleteAllNotifications,
} from "../Controllers/notificationController.js";
import { streamNotifications } from "../Controllers/sseController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const NotificationRouter = express.Router();
// this route is public and will be used to establish an SSE connection for notifications
NotificationRouter.get("/stream", streamNotifications);
// this middleware will verify the token for all routes below
NotificationRouter.use(verifyToken);

NotificationRouter.get("/", getNotifications);
NotificationRouter.get("/unread-count", getUnreadCount);
NotificationRouter.get("/preferences", getNotificationPreferences);
NotificationRouter.patch("/preferences", updateNotificationPreferences);
NotificationRouter.put("/read-all", markAllAsRead);
NotificationRouter.put("/:id/read", markAsRead);
NotificationRouter.put("/:id/seen", markAsSeen);
NotificationRouter.delete("/:id", deleteNotification);
NotificationRouter.delete("/", deleteAllNotifications);
export default NotificationRouter;
