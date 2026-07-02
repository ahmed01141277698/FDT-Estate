import { Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SubmitSection({
  loading,
  uploading,
  progress = 0,
  error,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10"
    >
      {/* Progress */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-700">اكتمال البيانات</span>

          <span className="font-bold text-blue-600">{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Submit */}

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl py-4 text-lg font-semibold transition flex items-center justify-center gap-3"
      >
        {loading || uploading ? (
          <>
            <Loader2 className="animate-spin" size={22} />

            {uploading ? "جارى رفع الصور..." : "جارى نشر العقار..."}
          </>
        ) : (
          <>
            <CheckCircle2 size={22} />
            نشر العقار
          </>
        )}
      </button>
    </motion.div>
  );
}
