const Home = () => {
  return (
    <main className="flex-grow">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              استكشف أفضل العقارات
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              ابحث عن منزلك الحلم بسهولة وأمان
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  عقارات متنوعة
                </h3>
                <p className="text-slate-600">مختارة بعناية من أفضل المواقع</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  آمن وموثوق
                </h3>
                <p className="text-slate-600">معاملات آمنة مع ضمانات كاملة</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  دعم 24/7
                </h3>
                <p className="text-slate-600">فريقنا هنا لمساعدتك دائماً</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-blue-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">هل أنت مستعد للبدء؟</h2>
            <p className="text-lg mb-6">
              ابحث عن العقار المثالي أو أضف عقارك الآن
            </p>
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-slate-100 transition">
              ابدأ البحث
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
