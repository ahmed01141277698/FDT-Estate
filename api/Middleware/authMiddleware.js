// import jwt from 'jsonwebtoken';
// import { errorHandler } from '../utils/errors.js';

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization || '';
//   const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

//   if (!token) {
//     return next(errorHandler(401, 'غير مصرح بالدخول. الرجاء تسجيل الدخول.'));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     console.error('JWT verification failed:', error);
//     return next(errorHandler(401, 'الرمز غير صالح أو منتهي الصلاحية.'));
//   }
// };

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

    // لو الباسورد اتغيّر بعد ما التوكن ده اتصدر، التوكن يبقى ملغي —
    // حتى لو لسه في مدة صلاحيته الأصلية (٧ أيام). ده اللي بيقفل الجلسات
    // القديمة فورًا بعد Reset Password.
    const user = await User.findById(decoded.id).select("passwordChangedAt");
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
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return next(errorHandler(401, "الرمز غير صالح أو منتهي الصلاحية."));
  }
};
