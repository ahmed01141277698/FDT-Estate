import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/errors.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(errorHandler(401, 'غير مصرح بالدخول. الرجاء تسجيل الدخول.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return next(errorHandler(401, 'الرمز غير صالح أو منتهي الصلاحية.'));
  }
};
