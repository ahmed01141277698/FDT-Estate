import Notification from "../Models/notificationModel.js";

// جلب إشعارات المستخدم الحالي — مع صفحات وفلتر "غير مقروءة فقط"
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.userId, read: false }),
    ]);

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

// عداد سريع بس — بيتنادى كل شوية من الجرس في الهيدر من غير ما يجيب الليستة كلها
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

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { read: true },
      { new: true },
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { read: true },
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.userId,
    });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * دالة مساعدة داخلية (مش route) — استدعيها من أي controller تاني عندك
 * لما يحصل حدث محتاج يبعت إشعار. مثال استخدام:
 *
 *   import { createNotification } from "./notificationController.js";
 *
 *   await createNotification({
 *     recipient: listing.userRef,
 *     type: "listing_liked",
 *     title: "حد حفظ عقارك",
 *     body: `${likerUsername} حفظ "${listing.name}" في المفضلة`,
 *     link: `/listing/${listing._id}`,
 *     relatedListing: listing._id,
 *     relatedUser: likerId,
 *   });
 */
export const createNotification = async ({
  recipient,
  type = "system",
  title,
  body,
  link,
  relatedListing,
  relatedUser,
}) => {
  try {
    return await Notification.create({
      recipient,
      type,
      title,
      body,
      link,
      relatedListing,
      relatedUser,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
};