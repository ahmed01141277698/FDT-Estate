import Listing from "../Models/listingModel.js";
import User from "../Models/user_Model.js";
import { getLocationById } from "../searchEngine/dictionary/locationDictionary.js";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export const getMarketInsights = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfWindow = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [totalListings, successfulDeals, verifiedAgencies, monthlyAgg, cityAgg] =
      await Promise.all([
        Listing.countDocuments(),

        // بيعتمد الآن على حقل `status` الحقيقي (available/sold/rented).
        Listing.countDocuments({ status: { $in: ["sold", "rented"] } }),

        User.countDocuments({ accountType: "agency", isVerified: true }),

        Listing.aggregate([
          { $match: { createdAt: { $gte: startOfWindow } } },
          {
            $group: {
              _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.y": 1, "_id.m": 1 } },
        ]),

        // `resolvedLocation` غالبًا اسم منطقة نضيف من قاموس المواقع (locationResolver.js) —
        // لو ظهر أي تفاوت في التجميع، راجع القيم الفعلية المخزّنة وعدّل هنا.
        Listing.aggregate([
          { $match: { resolvedLocation: { $ne: null } } },
          { $group: { _id: "$resolvedLocation", listings: { $sum: 1 } } },
          { $sort: { listings: -1 } },
          { $limit: 4 },
        ]),
      ]);

    // بناء مصفوفة آخر ١٢ شهر بالاسم الكامل — حتى لو مفيش بيانات لشهر معيّن يبقى صفر
    // بدل ما يختفي من الرسم، وده أيضًا يمنع تكرار مفاتيح الأشهر المختصرة زي "يل".
    const monthlyGrowth = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const match = monthlyAgg.find(
        (item) => item._id.y === d.getFullYear() && item._id.m === d.getMonth() + 1
      );
      monthlyGrowth.push({
        month: MONTH_NAMES[d.getMonth()],
        count: match ? match.count : 0,
      });
    }

    // نمو الطلب: مقارنة عدد العقارات المُضافة هذا الشهر بالشهر اللي قبله.
    // ده أقرب مؤشر متاح دلوقتي — عدّله لو "الطلب" هيتقاس بشكل مختلف (زيارات/بحث).
    const thisMonthCount = monthlyGrowth[monthlyGrowth.length - 1]?.count || 0;
    const lastMonthCount = monthlyGrowth[monthlyGrowth.length - 2]?.count || 0;
    const demandGrowth =
      lastMonthCount === 0
        ? 0
        : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);

    // `resolvedLocation` المخزّن على العقار هو `locationId` (معرّف داخلي)، مش اسم —
    // لازم يتترجم لاسمه الحقيقي (label) عن طريق قاموس المواقع قبل ما يوصل للفرونت.
    const topCities = await Promise.all(
      cityAgg.map(async (city) => {
        const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [thisMonth, lastMonth] = await Promise.all([
          Listing.countDocuments({
            resolvedLocation: city._id,
            createdAt: { $gte: startThisMonth },
          }),
          Listing.countDocuments({
            resolvedLocation: city._id,
            createdAt: { $gte: startLastMonth, $lt: startThisMonth },
          }),
        ]);

        const growth =
          lastMonth === 0 ? 0 : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

        const location = getLocationById(city._id);

        return {
          name: location?.label || city._id,
          listings: city.listings,
          growth,
        };
      })
    );

    res.status(200).json({
      totalListings,
      successfulDeals,
      verifiedAgencies,
      demandGrowth,
      monthlyGrowth,
      topCities,
    });
  } catch (error) {
    next(error);
  }
};