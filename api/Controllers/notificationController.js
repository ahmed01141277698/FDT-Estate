import Notification from "../Models/notificationModel.js";
import User from "../Models/user_Model.js";
import { NOTIFICATION_TYPES } from "../Constants/notificationTypes.js";
import { sendToUser } from "./sseController.js";

const PREFERENCE_SUPPRESSIBLE_TYPES = new Set([
  NOTIFICATION_TYPES.MESSAGE,
  NOTIFICATION_TYPES.LISTING_LIKED,
  NOTIFICATION_TYPES.PRICE_CHANGE,
  NOTIFICATION_TYPES.LISTING_APPROVED,
  NOTIFICATION_TYPES.PASSWORD_CHANGE,
  NOTIFICATION_TYPES.NEW_DEVICE_LOGIN,
  NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT,
  NOTIFICATION_TYPES.ACCOUNT_SUSPENSION,
  NOTIFICATION_TYPES.AVATAR_CHANGE,
]);

const isNotificationAllowed = async (recipient, type) => {
  if (!PREFERENCE_SUPPRESSIBLE_TYPES.has(type)) return true;

  const user = await User.findById(recipient).select("notificationPreferences");
  if (!user) return true;

  const prefs = user.notificationPreferences || {};
  return prefs[type] !== false;
};

// get notifications list — pagination, filtering, and marking unseen as seen
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const filter = { recipient: req.userId };
    if (unreadOnly === "true") filter.read = false;

    const numericPage = Math.max(Number(page) || 1, 1);
    const numericLimit = Math.min(Number(limit) || 20, 50);
    const skip = (numericPage - 1) * numericLimit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .populate("relatedUser", "username avatar")
        .populate("relatedListing", "name imageUrl")
        .populate("actors", "username avatar")
        .sort({ lastActivityAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.userId, read: false }),
    ]);

    const unseenIds = notifications.filter((n) => !n.seen).map((n) => n._id);

    if (unseenIds.length > 0) {
      Notification.updateMany(
        { _id: { $in: unseenIds } },
        { seen: true, seenAt: new Date() },
      ).catch((err) =>
        console.error("Failed to mark notifications as seen:", err),
      );

      notifications.forEach((n) => {
        if (unseenIds.some((id) => id.equals(n._id))) n.seen = true;
      });
    }

    res.status(200).json({
      notifications,
      total,
      unreadCount,
      page: numericPage,
      totalPages: Math.ceil(total / numericLimit),
    });
  } catch (error) {
    next(error);
  }
};

// get unread notifications count for the logged-in user
export const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      read: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    next(error);
  }
};
// mark a notification as read and send an SSE update to the user
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { read: true, readAt: new Date(), seen: true, seenAt: new Date() },
      { new: true },
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    //  send an SSE update to the user to indicate that a notification has been read

    sendToUser(String(req.userId), { type: "read" });

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};
// mark all notifications as read for the logged-in user and send an SSE update to the user
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { read: true, readAt: new Date(), seen: true, seenAt: new Date() },
    );

    sendToUser(String(req.userId), { type: "read" });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};
// mark a notification as seen and send an SSE update to the user
export const markAsSeen = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId, seen: false },
      { seen: true, seenAt: new Date() },
      { new: true },
    );
    res.status(200).json({ notification: notification || null });
  } catch (error) {
    next(error);
  }
};
// delete a notification for the logged-in user
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.userId,
    });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!notification.read) {
      sendToUser(String(req.userId), { type: "read" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

// GET /api/notifications/preferences
export const getNotificationPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select(
      "notificationPreferences",
    );
    const defaults = {
      message: true,
      listing_liked: true,
      price_change: true,
      listing_approved: true,
      password_change: true,
      new_device_login: true,
      system_announcement: true,
      account_suspension: true,
      avatar_change: true,
    };
    res.status(200).json({
      preferences: {
        ...defaults,
        ...(user?.notificationPreferences?.toObject?.() ??
          user?.notificationPreferences ??
          {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/notifications/preferences
export const updateNotificationPreferences = async (req, res, next) => {
  try {
    // validate the request body to only allow boolean values for known keys
    const allowedKeys = [
      "message",
      "listing_liked",
      "price_change",
      "listing_approved",
      "password_change",
      "new_device_login",
      "system_announcement",
      "account_suspension",
      "avatar_change",
    ];
    const updates = {};
    for (const key of allowedKeys) {
      if (typeof req.body[key] === "boolean") {
        updates[`notificationPreferences.${key}`] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true },
    ).select("notificationPreferences");

    res.status(200).json({ preferences: user.notificationPreferences });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async ({
  recipient,
  type = NOTIFICATION_TYPES.SYSTEM,
  title,
  body,
  link,
  relatedListing,
  relatedUser,
  deduplicationKey,
}) => {
  try {
    const allowed = await isNotificationAllowed(recipient, type);
    if (!allowed) return null;

    const notification = await Notification.create({
      recipient,
      type,
      title,
      body,
      link,
      relatedListing,
      relatedUser,
      ...(deduplicationKey && { deduplicationKey }),
    });

    sendToUser(String(recipient), { type: "notification", notification });

    return notification;
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.deduplicationKey) {
      return null;
    }
    console.error("Failed to create notification:", error);
    return null;
  }
};

export const upsertGroupedNotification = async ({
  recipient,
  groupKey,
  type = NOTIFICATION_TYPES.SYSTEM,
  link,
  relatedListing,
  actorId,
  buildTitle,
  buildBody,
}) => {
  try {
    const allowed = await isNotificationAllowed(recipient, type);
    if (!allowed) return null;

    const existing = await Notification.findOne({
      recipient,
      groupKey,
      read: false,
    });

    if (existing) {
      const alreadyCounted =
        actorId && existing.actors.some((a) => a.equals(actorId));

      if (alreadyCounted) return existing;

      existing.groupCount += 1;
      if (actorId) {
        existing.actors.unshift(actorId);
        existing.actors = existing.actors.slice(0, 5);
      }
      existing.title = buildTitle(existing.groupCount);
      existing.body = buildBody(existing.groupCount);
      existing.lastActivityAt = new Date();
      existing.seen = false;
      await existing.save();

      sendToUser(String(recipient), {
        type: "notification",
        notification: existing,
      });
      return existing;
    }

    const notification = await Notification.create({
      recipient,
      type,
      groupKey,
      title: buildTitle(1),
      body: buildBody(1),
      link,
      relatedListing,
      actors: actorId ? [actorId] : [],
      groupCount: 1,
      lastActivityAt: new Date(),
    });

    sendToUser(String(recipient), { type: "notification", notification });
    return notification;
  } catch (error) {
    console.error("Failed to upsert grouped notification:", error);
    return null;
  }
};

// delete all notifications for the logged-in user and send an SSE update to the user
export const deleteAllNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.userId,
    });

    sendToUser(String(req.userId), {
      type: "notifications_cleared",
    });

    res.status(200).json({
      message: "All notifications deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};
