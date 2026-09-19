import jwt from "jsonwebtoken";
import User from "../Models/user_Model.js";
import { errorHandler } from "../utils/errors.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return next(errorHandler(401, "غير مصرح بالدخول. الرجاء تسجيل الدخول."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "passwordChangedAt role",
    );
    if (user?.passwordChangedAt) {
      const changedAtSeconds = Math.floor(
        user.passwordChangedAt.getTime() / 1000,
      );
      if (decoded.iat < changedAtSeconds) {
        return next(
          errorHandler(401, "انتهت صلاحية جلستك، من فضلك سجّل الدخول تاني."),
        );
      }
    }

    req.userId = decoded.id;
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return next(errorHandler(401, "الرمز غير صالح أو منتهي الصلاحية."));
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(errorHandler(401, "غير مصرح بالدخول. الرجاء تسجيل الدخول."));
    }

    const user = await User.findById(req.userId).select("role");
    const isAdmin = user?.role === "admin" || user?.isAdmin === true;

    if (!isAdmin) {
      return next(errorHandler(403, "لا توجد صلاحية لتنفيذ هذا الإجراء."));
    }

    next();
  } catch (error) {
    next(errorHandler(500, "فشل التحقق من صلاحية الإدارة."));
  }
};
