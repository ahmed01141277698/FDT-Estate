// import User from '../Models/user_Model.js';
// import bcrypt from 'bcryptjs';
// import { errorHandler } from '../utils/errors.js';

// export const getProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     if (!user) {
//       return next(errorHandler(404, 'المستخدم غير موجود'));
//     }
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     next(errorHandler(500, 'حدث خطأ أثناء جلب بيانات المستخدم'));
//   }
// };

// export const updateProfile = async (req, res, next) => {
//   try {
//     const { username, email, password, avatar } = req.body;

//     if (!username && !email && !password && !avatar) {
//       return next(errorHandler(400, 'لا يوجد بيانات للتحديث'));
//     }

//     if (email) {
//       const existingEmailUser = await User.findOne({ email, _id: { $ne: req.userId } });
//       if (existingEmailUser) {
//         return next(errorHandler(400, 'هذا البريد الإلكتروني مستخدم بالفعل'));
//       }
//     }

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return next(errorHandler(404, 'المستخدم غير موجود'));
//     }

//     if (username) user.username = username;
//     if (email) user.email = email;
//     if (avatar) user.avatar = avatar;
//     if (password) {
//       user.password = await bcrypt.hash(password, 10);
//     }

//     await user.save();

//     const { password: pass, ...rest } = user._doc;
//     res.status(200).json({ success: true, user: rest });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     next(errorHandler(500, 'حدث خطأ أثناء تحديث الملف الشخصي'));
//   }
// };

// export const deleteProfile = async (req, res, next) => {
//   try {
//     const user = await User.findByIdAndDelete(req.userId);
//     if (!user) {
//       return next(errorHandler(404, 'المستخدم غير موجود'));
//     }
//     res.status(200).json({ success: true, message: 'تم حذف الحساب بنجاح' });
//   } catch (error) {
//     console.error('Error deleting profile:', error);
//     next(errorHandler(500, 'حدث خطأ أثناء حذف الحساب'));
//   }
// };


// import User from '../Models/user_Model.js';
// import bcrypt from 'bcryptjs';
// import { errorHandler } from '../utils/errors.js';
// import fs from 'fs';
// import path from 'path';

// export const getProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     next(errorHandler(500, 'حدث خطأ أثناء جلب بيانات المستخدم'));
//   }
// };

// export const uploadAvatar = async (req, res, next) => {
//   try {
//     if (!req.file) return next(errorHandler(400, 'لم يتم رفع أي صورة'));

//     const user = await User.findById(req.userId);
//     if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));

//     // احذف الصورة القديمة لو موجودة على السيرفر
//     if (user.avatar && user.avatar.startsWith('/uploads/')) {
//       const oldPath = path.join(process.cwd(), user.avatar);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//     }

//     const avatarUrl = `/uploads/avatars/${req.file.filename}`;
//     user.avatar = avatarUrl;
//     await user.save();

//     const { password: pass, ...rest } = user._doc;
//     res.status(200).json({ success: true, url: avatarUrl, user: rest });
//   } catch (error) {
//     console.error('Error uploading avatar:', error);
//     next(errorHandler(500, 'حدث خطأ أثناء رفع الصورة'));
//   }
// };

// export const updateProfile = async (req, res, next) => {
//   try {
//     const { username, email, password, avatar } = req.body;

//     if (!username && !email && !password && !avatar)
//       return next(errorHandler(400, 'لا يوجد بيانات للتحديث'));

//     if (email) {
//       const existingEmailUser = await User.findOne({ email, _id: { $ne: req.userId } });
//       if (existingEmailUser)
//         return next(errorHandler(400, 'هذا البريد الإلكتروني مستخدم بالفعل'));
//     }

//     const user = await User.findById(req.userId);
//     if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));

//     if (username) user.username = username;
//     if (email) user.email = email;
//     if (avatar) user.avatar = avatar;
//     if (password) user.password = await bcrypt.hash(password, 10);

//     await user.save();

//     const { password: pass, ...rest } = user._doc;
//     res.status(200).json({ success: true, user: rest });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     next(errorHandler(500, 'حدث خطأ أثناء تحديث الملف الشخصي'));
//   }
// };

// export const deleteProfile = async (req, res, next) => {
//   try {
//     const user = await User.findByIdAndDelete(req.userId);
//     if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));
//     res.status(200).json({ success: true, message: 'تم حذف الحساب بنجاح' });
//   } catch (error) {
//     next(errorHandler(500, 'حدث خطأ أثناء حذف الحساب'));
//   }
// };

import User from '../Models/user_Model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/errors.js';
import fs from 'fs';
import path from 'path';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(errorHandler(500, 'حدث خطأ أثناء جلب بيانات المستخدم'));
  }
};
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(errorHandler(404, "المستخدم غير موجود"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(errorHandler(500, "حدث خطأ أثناء جلب بيانات المستخدم"));
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return next(errorHandler(400, 'لم يتم رفع أي صورة'));

    const user = await User.findById(req.userId);
    if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));

    // احذف الصورة القديمة لو موجودة على السيرفر
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    const { password: pass, ...rest } = user._doc;
    res.status(200).json({ success: true, url: avatarUrl, user: rest });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    next(errorHandler(500, 'حدث خطأ أثناء رفع الصورة'));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username && !email && !password && !avatar)
      return next(errorHandler(400, 'لا يوجد بيانات للتحديث'));

    if (email) {
      const existingEmailUser = await User.findOne({ email, _id: { $ne: req.userId } });
      if (existingEmailUser)
        return next(errorHandler(400, 'هذا البريد الإلكتروني مستخدم بالفعل'));
    }

    const user = await User.findById(req.userId);
    if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    const { password: pass, ...rest } = user._doc;
    res.status(200).json({ success: true, user: rest });
  } catch (error) {
    console.error('Error updating profile:', error);
    next(errorHandler(500, 'حدث خطأ أثناء تحديث الملف الشخصي'));
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));
    res.status(200).json({ success: true, message: 'تم حذف الحساب بنجاح' });
  } catch (error) {
    next(errorHandler(500, 'حدث خطأ أثناء حذف الحساب'));
  }
};