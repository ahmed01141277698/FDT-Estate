import User from "../Models/user_Model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import { createNotification } from "./notificationController.js";
import { NOTIFICATION_TYPES } from "../Constants/notificationTypes.js";
import { issueNewOtp } from "./verificationController.js";

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Cookie options for secure storage
const cookieOptions = {
  httpOnly: true,
  ...(process.env.NODE_ENV === "production"
    ? { secure: true, sameSite: "none" }
    : {}),
};

// Sign Up Controller
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone)
      return next(errorHandler(400, "جميع الحقول مطلوبة"));
    if (password.length < 6)
      return next(
        errorHandler(400, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
      );
    if (!validateEmail(email))
      return next(errorHandler(400, "البريد الإلكتروني غير صحيح"));

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return next(errorHandler(400, "البريد الإلكتروني مستخدم بالفعل"));

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return next(errorHandler(400, "اسم المستخدم مستخدم بالفعل"));
    const existingPhone = await User.findOne({ phone });
    if (existingPhone)
      return next(errorHandler(400, "رقم الهاتف مستخدم بالفعل"));

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      isVerified: false,
      authProvider: "local",
    });

    await newUser.save();

    try {
      await issueNewOtp(newUser);
    } catch (emailError) {
      console.error("فشل إرسال إيميل التحقق:", emailError);
    }

    res.status(201).json({
      success: true,
      code: "EMAIL_VERIFICATION_REQUIRED",
      message:
        "تم إنشاء الحساب، من فضلك تحقق من بريدك الإلكتروني بالرمز المُرسل إليك",
      email: newUser.email,
    });
  } catch (error) {
    console.error("خطأ في التسجيل:", error);
    next(errorHandler(500, "حدث خطأ في إنشاء الحساب"));
  }
};

// Sign In Controller
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(errorHandler(400, "البريد وكلمة المرور مطلوبان"));

    const user = await User.findOne({ email });
    if (!user)
      return next(
        errorHandler(404, "المستخدم غير موجود. من فضلك سجّل حساب جديد"),
      );

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return next(
        errorHandler(401, "البريد الإلكتروني أو كلمة المرور غير صحيحة"),
      );

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "من فضلك وثّق بريدك الإلكتروني قبل تسجيل الدخول",
        email: user.email,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    const { password: pass, ...rest } = user._doc;

    res.cookie("access_token", token, cookieOptions).status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: rest,
    });
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error);
    next(errorHandler(500, "حدث خطأ في تسجيل الدخول"));
  }
};
// Google Sign In Controller
export const google = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email || !name)
      return next(errorHandler(400, "البريد والاسم مطلوبان"));
    if (!validateEmail(email))
      return next(errorHandler(400, "البريد الإلكتروني غير صحيح"));

    let user = await User.findOne({ email });

    if (user) {
      const defaultAvatar =
        "https://www.istockphoto.com/photo/mountain-landscape-gm517188688-89380423";
      if (avatar && (!user.avatar || user.avatar === defaultAvatar)) {
        user.avatar = avatar;
      }
      if (!user.isVerified) user.isVerified = true;
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      const { password: pass, ...rest } = user._doc;

      return res.cookie("access_token", token, cookieOptions).status(200).json({
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        token,
        user: rest,
      });
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const emailPrefix = email.split("@")[0];
    const rawBase = (name && name.split(" ")[0]) || emailPrefix || "user";
    let baseUsername =
      rawBase
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, "")
        .slice(0, 20) || "user";

    let username = baseUsername;
    let counter = 0;
    while (await User.findOne({ username })) {
      counter += 1;
      username = `${baseUsername}${counter}`;
      if (counter > 1000) break;
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar:
        avatar ||
        "https://www.istockphoto.com/photo/mountain-landscape-gm517188688-89380423",
      isVerified: true,
      authProvider: "google", // Marking the user as registered via Google OAuth
    });

    const savedUser = await newUser.save();

    await createNotification({
      recipient: savedUser._id,
      type: NOTIFICATION_TYPES.SYSTEM,
      title: `أهلاً بيك في عقاركس يا ${username}`,
      body: "ابدأ استكشاف العقارات أو أضف أول إعلان ليك الان!",
      link: "/",
      deduplicationKey: `welcome:${savedUser._id}`,
    });

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    const { password: pass, ...rest } = savedUser._doc;

    res.cookie("access_token", token, cookieOptions).status(201).json({
      success: true,
      message: "تم إنشاء الحساب وتسجيل الدخول بنجاح",
      token,
      user: rest,
    });
  } catch (error) {
    console.error("خطأ في Google OAuth:", error);
    next(errorHandler(500, "حدث خطأ في تسجيل الدخول عبر Google"));
  }
};
