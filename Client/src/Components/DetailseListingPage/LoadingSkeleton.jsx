export default function LoadingSkeleton() {
  return (
    <div
      dir="rtl"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-pulse"
    >
      <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-10">
        <div className="col-span-4 md:col-span-2 row-span-2 bg-slate-200 rounded-2xl" />
        <div className="hidden md:block bg-slate-200 rounded-2xl" />
        <div className="hidden md:block bg-slate-200 rounded-2xl" />
        <div className="hidden md:block bg-slate-200 rounded-2xl" />
        <div className="hidden md:block bg-slate-200 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded-full" />
            <div className="h-9 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-5 w-1/2 bg-slate-200 rounded-lg" />
            <div className="h-10 w-40 bg-slate-200 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded-full" />
            <div className="h-4 bg-slate-200 rounded-full" />
            <div className="h-4 w-2/3 bg-slate-200 rounded-full" />
          </div>
        </div>

        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    </div>
  );
}
