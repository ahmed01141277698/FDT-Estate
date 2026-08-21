import crypto from "crypto";

// رمز مكوّن من ٦ أرقام، مولّد بمصدر عشوائية آمن تشفيريًا (crypto.randomInt)،
// أبدًا مش Math.random().
export function generateOtp() {
  const num = crypto.randomInt(0, 1_000_000);
  return num.toString().padStart(6, "0");
}

// بنخزّن الـ hash بس، أبدًا مش الرمز نفسه.
export function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// مقارنة آمنة زمنيًا (constant-time) عشان نمنع Timing Attacks.
export function verifyOtpHash(otp, storedHash) {
  const computedHash = hashOtp(otp);
  const a = Buffer.from(computedHash);
  const b = Buffer.from(storedHash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}