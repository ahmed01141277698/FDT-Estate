import { Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SubmitSection({
  loading,
  uploading,
  progress = 0,
  error,
  isEdit = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10"
    >
      <div className="mb-6 rounded-[24px] border border-[#e7e2d7] bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-[#183d37]">
            اكتمال البيانات
          </span>
          <span className="text-sm font-black text-[#e49263]">{progress}%</span>
        </div>

        <div className="h-3 w-full rounded-full bg-[#f1efe8]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-3 rounded-full bg-gradient-to-r from-[#e49263] to-[#e8c56d]"
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || uploading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#e49263] py-4 text-lg font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/25 transition hover:bg-[#f1b68b] disabled:cursor-not-allowed disabled:bg-[#e7e2d7] disabled:text-[#a9beb5] disabled:shadow-none"
      >
        {loading || uploading ? (
          <>
            <Loader2 className="animate-spin" size={22} />
            {uploading
              ? "جارى رفع الصور..."
              : isEdit
                ? "جارى تحديث العقار..."
                : "جارى نشر العقار..."}
          </>
        ) : (
          <>
            <CheckCircle2 size={22} />
            {isEdit ? "تحديث العقار" : "نشر العقار"}
          </>
        )}
      </button>
    </motion.div>
  );
}
