# FDT Estate — Smart Search (adapted to your real schema)

This version is adapted specifically to your actual `Listing` model,
controllers, and router — field names, `type` enum, ESM syntax, all matched.
**Nothing in your existing files is replaced.** Two markdown files describe
exact, minimal patches; everything else is new, additive files.

## What to read first

1. **`SCHEMA_CHANGES.md`** — exact diff for `listingModel.js` (3 new fields,
   3 indexes, 2 hooks). Explains *why* each piece is needed, including why
   the `findOneAndUpdate` hook specifically matters for your `updateListing`
   controller.
2. **`ROUTER_CHANGES.md`** — exact 2-line diff for `listingRouter.js`
   (1 import + 1 route, with an explanation of why it must go above `/:id`).

## New files (drop in as-is, nothing to merge)

```
Controlles/searchController.js      # new controller, doesn't touch listingControll.js
searchEngine/                       # the engine itself (framework-agnostic)
├── normalize/    (arabicNormalizer, englishNormalizer, textCleaner)
├── dictionary/   (locationDictionary, propertyTypeDictionary, purposeDictionary)
├── resolvers/    (location, property, purpose, price, room)
├── utils/        (tokenizer, levenshtein, keywordGenerator)
├── queryBuilder/ (mongoQueryBuilder)
├── ranking/      (rankingService)
└── searchService.js                # orchestrates the whole pipeline
```

## Decisions applied from your answers

- **No `propertyType` field added.** Property type matching runs entirely
  through `searchKeywords`. Both at listing-creation time (keywords are
  expanded with every alias of the detected type — "فيلا" also stores
  "villa") and at query time (search also expands to every alias), so
  either language finds the same listings without needing the field.
- **`featured: Boolean` added**, defaults to `false`, used in the ranking
  sort. Existing documents are unaffected until next saved.

## Field mapping used throughout

| Concept | Your field | Notes |
|---|---|---|
| Title | `name` | not `title` |
| Sale/Rent | `type` (`'rent'` \| `'sell'`) | resolver output ids match your enum exactly |
| Location | `resolvedLocation` (new) | derived from `address`, no external API |
| Property type | *(none — via `searchKeywords`)* | see above |
| Bedrooms/bathrooms/price | `bedrooms`, `bathrooms`, `price` | unchanged, used as-is |

## Once you've applied both patches

```
GET /listing/search?q=شقة الشيخ زايد
GET /listing/search?q=فيلا 12 مليون
GET /listing/search?q=اقل من 8 مليون شقة زايد
```
(adjust the base path to wherever `ListingRouter` is mounted in your app)

Run the one-time backfill script in `SCHEMA_CHANGES.md` afterward so
existing listings get `searchKeywords`/`resolvedLocation` populated.



# نظام التحقق بالإيميل — توثيق الـ API للفرونت إند

## تدفق الاستخدام الكامل

```
POST /api/auth/signUp
        ↓
   EMAIL_VERIFICATION_REQUIRED
        ↓
الفرونت إند يودّي المستخدم لصفحة /verify-email (مع تمرير الإيميل)
        ↓
المستخدم يكتب الرمز المكوّن من ٦ أرقام
        ↓
POST /api/auth/verify-email
        ↓
   نجاح → الفرونت إند يودّي لصفحة /signin
        ↓
POST /api/auth/signIn
        ↓
   نجاح → توكن + بيانات اليوزر (زي ما كان بالظبط قبل كده)
```

---

## 1) POST /api/auth/signUp

**Request Body:**
```json
{
  "username": "ahmed_ali",
  "email": "ahmed@example.com",
  "phone": "01012345678",
  "password": "123456"
}
```

**نجاح (201):**
```json
{
  "success": true,
  "code": "EMAIL_VERIFICATION_REQUIRED",
  "message": "تم إنشاء الحساب، من فضلك تحقق من بريدك الإلكتروني بالرمز المُرسل إليك",
  "email": "ahmed@example.com"
}
```
> **مهم:** الرد ده اتغيّر عن السلوك القديم — مفيش توكن دلوقتي. الفرونت إند لازم يودّي المستخدم لصفحة `/verify-email?email=...` مباشرة، مش `/signin` زي ما كان قبل كده.

**أخطاء محتملة:** نفس الأخطاء القديمة تمامًا (400 لحقول ناقصة/إيميل مستخدم/يوزرنيم مستخدم/باسورد قصير)، بالإضافة لـ `429` لو تجاوز حد المحاولات (rate limit).

---

## 2) POST /api/auth/verify-email

**Request Body:**
```json
{ "email": "ahmed@example.com", "code": "123456" }
```

**نجاح (200):**
```json
{
  "success": true,
  "message": "تم توثيق بريدك الإلكتروني بنجاح، يمكنك تسجيل الدخول الآن",
  "user": { "_id": "...", "username": "...", "isVerified": true, "...": "..." }
}
```

**أكواد الأخطاء (كلها بنفس الشكل: `{ success: false, code, message }`):**

| الكود | الحالة | الأكشن المقترح في الفرونت |
|---|---|---|
| `INVALID_VERIFICATION_CODE` (400) | الرمز غلط أو مفيش رمز فعّال | يبان تحت خانة الإدخال، يسيب المستخدم يحاول تاني |
| `VERIFICATION_CODE_EXPIRED` (400) | الرمز خلصت صلاحيته | يظهر زرار "إعادة إرسال" بشكل بارز |
| `VERIFICATION_ATTEMPTS_EXCEEDED` (429) | محاولات غلط كتير | يقفل خانة الإدخال ويطلب إعادة إرسال رمز جديد |
| `EMAIL_ALREADY_VERIFIED` (200, success: true) | الإيميل متحقق منه بالفعل | يودّي المستخدم لصفحة الدخول مباشرة |

---

## 3) POST /api/auth/resend-verification

**Request Body:**
```json
{ "email": "ahmed@example.com" }
```

**نجاح (200) — نفس الرد دايمًا حتى لو الحساب مش موجود (أمان):**
```json
{ "success": true, "message": "لو الحساب ده موجود ومحتاج توثيق، هيوصله رمز تحقق جديد الآن" }
```

**أخطاء:**

| الكود | الحالة | الأكشن المقترح |
|---|---|---|
| `RESEND_COOLDOWN` (429) | لسه بدري على طلب رمز جديد | يعرض عداد تنازلي بالثواني (`retryAfterSeconds` موجودة في الرد) ويعطّل الزرار لحد ما يخلص |
| `TOO_MANY_REQUESTS` (429) | وصل للحد الأقصى من الإعادة | يقفل الزرار ويقترح التواصل مع الدعم |

---

## 4) POST /api/auth/signIn (السلوك القديم + إضافة واحدة بس)

**نفس الـ Request/Response القديم تمامًا في حالة النجاح.** الإضافة الوحيدة:

**رد جديد لو الحساب مش موثّق بعد (403):**
```json
{
  "success": false,
  "code": "EMAIL_NOT_VERIFIED",
  "message": "من فضلك وثّق بريدك الإلكتروني قبل تسجيل الدخول",
  "email": "ahmed@example.com"
}
```
الفرونت إند لازم يتحقق من `code === "EMAIL_NOT_VERIFIED"` ويودّي المستخدم لـ `/verify-email?email=...` بدل ما يعرضها كـ error عادي.

---

## أكواد عامة تتكرر في أي راوت من الأربعة

| الكود | الحالة |
|---|---|
| `TOO_MANY_REQUESTS` (429) | حد الـ rate limit اتعدّى |