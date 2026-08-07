export default function LoadingSkeleton() {
  return (
    <div
      dir="rtl"
      className="mx-auto max-w-7xl animate-pulse px-4 py-8 md:px-8"
    >
      <div className="mb-10 grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:h-[500px] md:gap-3">
        <div className="col-span-4 row-span-2 rounded-2xl bg-[#f1efe8] md:col-span-2" />
        <div className="hidden rounded-2xl bg-[#f1efe8] md:block" />
        <div className="hidden rounded-2xl bg-[#f1efe8] md:block" />
        <div className="hidden rounded-2xl bg-[#f1efe8] md:block" />
        <div className="hidden rounded-2xl bg-[#f1efe8] md:block" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-[#f1efe8]" />
            <div className="h-9 w-3/4 rounded-lg bg-[#f1efe8]" />
            <div className="h-5 w-1/2 rounded-lg bg-[#f1efe8]" />
            <div className="h-10 w-40 rounded-lg bg-[#f1efe8]" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#f1efe8]" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-4 rounded-full bg-[#f1efe8]" />
            <div className="h-4 rounded-full bg-[#f1efe8]" />
            <div className="h-4 w-2/3 rounded-full bg-[#f1efe8]" />
          </div>
        </div>

        <div className="h-96 rounded-3xl bg-[#f1efe8]" />
      </div>
    </div>
  );
}
