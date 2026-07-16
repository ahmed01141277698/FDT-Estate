const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Mock data: structure matches what the UI needs.
// Swap implementations later to call real backend endpoints.

const MOCK = {
  featuredProperties: {
    properties: [
      {
        id: 1,
        title: "فيلا فاخرة مع مسبح خاص",
        price: "٤٬٨٠٠٬٠٠٠",
        currency: "ريال",
        location: "الرياض، حي الياسمين",
        beds: 6,
        baths: 5,
        area: "٦٥٠",
        agency: "FDT العقارية",
        image:
          "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80",
        featured: true,
        verified: true,
      },
      {
        id: 2,
        title: "شقة بانورامية على كورنيش جدة",
        price: "١٬٩٥٠٬٠٠٠",
        currency: "ريال",
        location: "جدة، كورنيش الروضة",
        beds: 3,
        baths: 2,
        area: "٢٤٠",
        agency: "مجموعة الخليج",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        featured: false,
        verified: true,
      },
      {
        id: 3,
        title: "تاون هاوس عصري في مشروع متكامل",
        price: "٢٬٢٠٠٬٠٠٠",
        currency: "ريال",
        location: "الدمام، حي الشاطئ",
        beds: 4,
        baths: 3,
        area: "٣٨٠",
        agency: "دار المستقبل",
        image:
          "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
        featured: true,
        verified: false,
      },
      {
        id: 4,
        title: "بنتهاوس حصري بإطلالة المدينة",
        price: "٧٬٥٠٠٬٠٠٠",
        currency: "ريال",
        location: "الرياض، العليا",
        beds: 5,
        baths: 4,
        area: "٨٠٠",
        agency: "FDT العقارية",
        image:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        featured: true,
        verified: true,
      },
    ],
  },
  latestProperties: {
    properties: [
      {
        id: "l1",
        title: "شقة حديثة بإطلالة مفتوحة",
        price: "٢٬٦٠٠٬٠٠٠",
        currency: "ريال",
        location: "الرياض، حي الازدهار",
        beds: 3,
        baths: 2,
        area: "٢٢٠",
        agency: "وكالة FDT",
        image:
          "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80",
        featured: false,
        verified: true,
      },
      {
        id: "l2",
        title: "فيلا عائلية بموقع مميز",
        price: "٤٬٣٥٠٬٠٠٠",
        currency: "ريال",
        location: "جدة، حي المرجان",
        beds: 5,
        baths: 4,
        area: "٤٥٠",
        agency: "FDT العقارية",
        image:
          "https://images.unsplash.com/photo-1564013799919-ab600c1b5f4c?w=800&q=80",
        featured: false,
        verified: true,
      },
      {
        id: "l3",
        title: "دوبلكس راقٍ بالقرب من الخدمات",
        price: "٣٬١٠٠٬٠٠٠",
        currency: "ريال",
        location: "الدمام، حي الخبر",
        beds: 4,
        baths: 3,
        area: "٣٢٠",
        agency: "دار المستقبل",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
        featured: false,
        verified: false,
      },
      {
        id: "l4",
        title: "أرض سكنية جاهزة للتطوير",
        price: "١٬٢٥٠٬٠٠٠",
        currency: "ريال",
        location: "المدينة المنورة، مخطط النخيل",
        beds: 0,
        baths: 0,
        area: "٨٠٠",
        agency: "FDT العقارية",
        image:
          "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
        featured: false,
        verified: true,
      },
    ],
  },
  areas: {
    areas: [
      {
        id: "a1",
        name: "October",
        image:
          "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=1200&q=80",
        count: 312,
      },
      {
        id: "a2",
        name: "Sheikh Zayed",
        image:
          "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80",
        count: 240,
      },
      {
        id: "a3",
        name: "New Cairo",
        image:
          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80",
        count: 520,
      },
      {
        id: "a4",
        name: "New Capital",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
        count: 180,
      },
      {
        id: "a5",
        name: "North Coast",
        image:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
        count: 140,
      },
      {
        id: "a6",
        name: "Alexandria",
        image:
          "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=1200&q=80",
        count: 96,
      },
    ],
  },
  faq: {
    items: [
      {
        id: "f1",
        q: "كيف أضمن أن القائمة موثوقة؟",
        a: "كل العقارات يتم مراجعتها والتأكد من بياناتها قبل النشر. كما يمكنك رؤية علامة التوثيق على البطاقة.",
      },
      {
        id: "f2",
        q: "هل يمكنني حفظ العقارات؟",
        a: "نعم. زر القلب يحفظ العقارات داخل جلسة التصفح (وبعد التكامل سيتم ربطه بحسابك).",
      },
      {
        id: "f3",
        q: "هل يوجد بحث ذكي؟",
        a: "نعم. واجهة البحث تساعدك باختيار المدينة ونوع العقار لتقليل الوقت للوصول للعقار المناسب.",
      },
    ],
  },
};

export const homeService = {
  async getFeaturedProperties() {
    await delay(250);
    return MOCK.featuredProperties;
  },

  async getLatestProperties() {
    await delay(250);
    return MOCK.latestProperties;
  },

  async getAreas() {
    await delay(200);
    return MOCK.areas;
  },

  async getFaq() {
    await delay(180);
    return MOCK.faq;
  },
};

