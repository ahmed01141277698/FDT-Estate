// Rate limiter بسيط في الذاكرة (in-memory) — كافي لسيرفر واحد (instance واحد).
// لو المشروع اتوسّع لأكتر من سيرفر خلف Load Balancer لاحقًا، هيحتاج ينتقل
// لحل مركزي زي Redis عشان العدّادات تتشارك بين كل السيرفرات.

const buckets = new Map();

export function simpleRateLimiter({ windowMs, max, message }) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        code: "TOO_MANY_REQUESTS",
        message: message || "محاولات كتير أوي، حاول تاني بعد شوية",
        retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
      });
    }

    next();
  };
}