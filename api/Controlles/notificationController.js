import Notification from "../Models/notificationModel.js";
import { NOTIFICATION_TYPES } from "../Constants/notificationTypes.js";

// جلب إشعارات المستخدم الحالي — مع صفحات وفلتر "غير مقروءة فقط".
// الترتيب بـ lastActivityAt مش createdAt، عشان إشعار مجمّع (زي مفضلة/اهتمام)
// لما يحصل فيه نشاط جديد يطلع فوق تاني في الليستة، حتى لو الإشعار نفسه
// اتعمل من زمان.
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
      // best-effort — مش محتاجين ننتظره قبل ما نرجّع الرد للمستخدم
      Notification.updateMany(
        { _id: { $in: unseenIds } },
        { seen: true, seenAt: new Date() },
      ).catch((err) => console.error("Failed to mark notifications as seen:", err));

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
      { read: true, readAt: new Date(), seen: true, seenAt: new Date() },
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
      { read: true, readAt: new Date(), seen: true, seenAt: new Date() },
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

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
 * دالة مساعدة داخلية — لإشعارات لمرة واحدة/فريدة (نشر عقار، تغيير سعر،
 * ترحيب). لو الحدث ممكن يتكرر بكثرة في وقت قصير (حفظ مفضلة، محاولات
 * تواصل)، استخدم upsertGroupedNotification تحتها بدل الدالة دي.
 *
 * مثال استخدام:
 *   await createNotification({
 *     recipient: listing.userRef,
 *     type: NOTIFICATION_TYPES.LISTING_APPROVED,
 *     title: "تم نشر عقارك بنجاح",
 *     link: `/listing/${listing._id}`,
 *     relatedListing: listing._id,
 *     deduplicationKey: `listing_published:${listing._id}`,
 *   });
 */
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
    return await Notification.create({
      recipient,
      type,
      title,
      body,
      link,
      relatedListing,
      relatedUser,
      ...(deduplicationKey && { deduplicationKey }),
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.deduplicationKey) {
      return null;
    }
    console.error("Failed to create notification:", error);
    return null;
  }
};

/**
 * التجميع الذكي — استخدمها لأي حدث ممكن يتكرر (حفظ مفضلة، محاولات تواصل).
 * طول ما فيه إشعار غير مقروء بنفس groupKey لنفس المستقبِل، أي حدث جديد
 * بيتجمّع فيه (بيزوّد groupCount ويحدّث العنوان/النص) بدل ما يعمل إشعار
 * مستقل. أول ما المستخدم يقرا الإشعار، أي حدث جديد بعد كده بيبدأ مجموعة
 * جديدة تلقائيًا (لأن الفلتر بيدوّر بس على read: false).
 *
 * لو actorId موجود وهو نفسه فاعل سابق في نفس المجموعة، العملية بتتجاهل
 * تمامًا (منع لعب/تلاعب زي حد يشيل ويرجّع يحفظ نفس العقار كذا مرة).
 *
 * buildTitle(count) / buildBody(count): دوال بترجع النص المناسب حسب عدد
 * الأحداث المجمّعة لحد دلوقتي.
 *
 * مثال استخدام:
 *   await upsertGroupedNotification({
 *     recipient: listing.userRef,
 *     groupKey: `favorite_group:${listing._id}`,
 *     type: NOTIFICATION_TYPES.LISTING_LIKED,
 *     link: `/listing/${listing._id}`,
 *     relatedListing: listing._id,
 *     actorId: userId,
 *     buildTitle: (count) =>
 *       count === 1
 *         ? `${actorName} حفظ عقارك في المفضلة`
 *         : `${actorName} و${count - 1} آخرين حفظوا عقارك في المفضلة`,
 *     buildBody: () => `عقارك "${listing.name}"`,
 *   });
 */
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
    const existing = await Notification.findOne({
      recipient,
      groupKey,
      read: false,
    });

    if (existing) {
      const alreadyCounted =
        actorId && existing.actors.some((a) => a.equals(actorId));

      if (alreadyCounted) return existing; // منع تكرار نفس الفاعل في نفس المجموعة

      existing.groupCount += 1;
      if (actorId) {
        existing.actors.unshift(actorId);
        existing.actors = existing.actors.slice(0, 5);
      }
      existing.title = buildTitle(existing.groupCount);
      existing.body = buildBody(existing.groupCount);
      existing.lastActivityAt = new Date();
      existing.seen = false; // نشاط جديد فعليًا، يستاهل يبان تاني كـ "جديد"
      await existing.save();
      return existing;
    }

    return await Notification.create({
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
  } catch (error) {
    console.error("Failed to upsert grouped notification:", error);
    return null;
  }
};