import jwt from "jsonwebtoken";

// خريطة: userId (string) -> Set من الـ response objects المتصلة حاليًا.
// بتدعم أكتر من تاب/جهاز لنفس المستخدم في نفس الوقت بشكل طبيعي.
//
// ⚠️ ده تخزين في الذاكرة (in-memory) — كافي تمامًا لسيرفر واحد. لو يومًا
// شغّلت أكتر من نسخة (instance) من السيرفر خلف load balancer، الإشعار
// هيوصل لحظيًا بس للتابات المتصلة بنفس النسخة اللي عملت الإشعار. مش
// محتاج تعقيد زي Redis pub/sub دلوقتي — دي مشكلة تتحل وقت ما فعلاً تحتاجها.
const clients = new Map();

export const registerClient = (userId, res) => {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);
};

export const removeClient = (userId, res) => {
  const set = clients.get(userId);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) clients.delete(userId);
};

// بتتنادى من notificationController.js بعد ما إشعار يتعمل/يتحدّث، عشان
// توصّله فورًا لأي تاب/جهاز مفتوح للمستخدم ده دلوقتي. لو مفيش اتصال
// مفتوح للمستخدم ده، بترجع بهدوء من غير أي تأثير — الإشعار أصلاً اتخزن
// في الداتابيز وهيوصل عادي أول ما يفتح الصفحة أو الـ polling يشتغل.
export const sendToUser = (userId, payload) => {
  const set = clients.get(String(userId));
  if (!set || set.size === 0) return;

  const data = `data: ${JSON.stringify(payload)}\n\n`;
  set.forEach((res) => {
    try {
      res.write(data);
    } catch {
      // الاتصال ممكن يكون اتقفل من غير ما الـ 'close' event يتلاقط بعد —
      // تجاهل بهدوء، الـ removeClient هيحصل من الـ listener أصلاً.
    }
  });
};

// GET /api/notifications/stream?token=...
// EventSource (الـ API الأصلي في المتصفح) مبيقدرش يبعت custom headers، فمش
// نقدر نستخدم verifyToken العادي (اللي غالبًا بيدوّر على Authorization
// header). بنستقبل التوكن كـ query param هنا بالتحديد ونتحقق منه يدويًا.
export const streamNotifications = (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).end();

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).end();
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    // مهم لو فيه nginx أو أي proxy قدام السيرفر، عشان ميعملش buffering
    // للستريم (وإلا الإشعارات هتوصل متأخرة على دفعات بدل لحظيًا).
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders?.();
  res.write(": connected\n\n");

  registerClient(String(userId), res);

  // نبضة كل 25 ثانية — تحافظ على الاتصال فاتح من خلال أي proxy/load
  // balancer بيقفل اتصالات ساكتة تلقائيًا، وكمان بتكتشف الاتصالات الميتة.
  const heartbeat = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(heartbeat);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient(String(userId), res);
    res.end();
  });
};