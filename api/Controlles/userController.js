


// import User from '../Models/user_Model.js';


// import bcrypt from 'bcryptjs';
// import { errorHandler } from '../utils/errors.js';
// import fs from 'fs';
// import path from 'path';
// import { uploadToCloudinary } from "./uploadController.js";
// import { deleteImage } from "../../config/cloudinary.js";



// export const getProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     next(errorHandler(500, 'حدث خطأ أثناء جلب بيانات المستخدم'));
//   }
// };
// export const getUserById = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");

//     if (!user) {
//       return next(errorHandler(404, "المستخدم غير موجود"));
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     next(errorHandler(500, "حدث خطأ أثناء جلب بيانات المستخدم"));
//   }
// };

// export const uploadAvatar = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return next(errorHandler(400, "لم يتم اختيار صورة"));
//     }

//     const user = await User.findById(req.userId);

//     if (!user) {
//       return next(errorHandler(404, "المستخدم غير موجود"));
//     }

//     // حذف الصورة القديمة من Cloudinary (لو موجودة)
//     if (user.avatar?.public_id) {
//       await deleteImage(user.avatar.public_id);
//     }

//     // رفع الصورة الجديدة
//     const uploadedImage = await uploadToCloudinary(
//       req.file,
//       "RealEstate/avatars"
//     );

//     user.avatar = {
//       url: uploadedImage.url,
//       public_id: uploadedImage.public_id,
//     };

//     await user.save();

//     const { password, ...rest } = user._doc;

//     res.status(200).json({
//       success: true,
//       message: "تم رفع الصورة بنجاح",
//       avatar: user.avatar,
//       user: rest,
//     });
//   } catch (error) {
//     console.error(error);
//     next(errorHandler(500, "حدث خطأ أثناء رفع الصورة"));
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
import Listing from '../Models/listingModel.js';
import Review from '../Models/reviewModel.js';
import Favorite from '../Models/favoriteModel.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/errors.js';
import { uploadToCloudinary } from "./uploadController.js";
import { deleteImage } from "../../config/cloudinary.js";

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
    if (!req.file) {
      return next(errorHandler(400, "لم يتم اختيار صورة"));
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return next(errorHandler(404, "المستخدم غير موجود"));
    }

    // حذف الصورة القديمة من Cloudinary (لو موجودة)
    if (user.avatar?.public_id) {
      await deleteImage(user.avatar.public_id);
    }

    // رفع الصورة الجديدة
    const uploadedImage = await uploadToCloudinary(
      req.file,
      "RealEstate/avatars"
    );

    user.avatar = {
      url: uploadedImage.url,
      public_id: uploadedImage.public_id,
    };

    await user.save();

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "تم رفع الصورة بنجاح",
      avatar: user.avatar,
      user: rest,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "حدث خطأ أثناء رفع الصورة"));
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

// حذف الحساب نهائيًا، مع تنظيف كل البيانات المرتبطة بيه (عقارات، صور
// Cloudinary، مراجعات، مفضلة) عشان مايفضلش بيانات يتيمة في الداتابيز.
export const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return next(errorHandler(404, 'المستخدم غير موجود'));

    // ١. هات كل عقارات اليوزر ده قبل ما نمسح أي حاجة.
    const userListings = await Listing.find({ userRef: req.userId });
    const listingIds = userListings.map((listing) => listing._id);

    // ٢. امسح صور كل عقار من Cloudinary (مش بس الـ document في الداتابيز).
    for (const listing of userListings) {
      if (Array.isArray(listing.imageUrl)) {
        for (const img of listing.imageUrl) {
          if (img.public_id) {
            await deleteImage(img.public_id).catch(() => {
              // لو صورة معينة فشلت تتمسح من Cloudinary، منوقفش عملية الحذف
              // كلها بسببها — بس نكمل الباقي.
            });
          }
        }
      }
    }

    // ٣. امسح صورة البروفايل بتاعة اليوزر نفسه من Cloudinary.
    if (user.avatar?.public_id) {
      await deleteImage(user.avatar.public_id).catch(() => {});
    }

    // ٤. امسح كل العقارات دفعة واحدة.
    await Listing.deleteMany({ userRef: req.userId });

    // ٥. امسح مراجعة اليوزر (لو كتب رأي في الموقع).
    await Review.deleteMany({ userRef: req.userId });

    // ٦. امسح كل حاجة في المفضلة بتاعته: (أ) العقارات اللي هو حفظها لنفسه،
    // (ب) أي حفظ من ناس تانية لعقاراته هو (بما إنها اتمسحت أصلاً، بياناتها
    // في المفضلة بقت يتيمة ولازم تتنضف).
    await Favorite.deleteMany({
      $or: [{ userRef: req.userId }, { listingRef: { $in: listingIds } }],
    });

    // ٧. أخيرًا، امسح اليوزر نفسه.
    await User.findByIdAndDelete(req.userId);

    res.status(200).json({ success: true, message: 'تم حذف الحساب وكل بياناتك المرتبطة بنجاح' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    next(errorHandler(500, 'حدث خطأ أثناء حذف الحساب'));
  }
};