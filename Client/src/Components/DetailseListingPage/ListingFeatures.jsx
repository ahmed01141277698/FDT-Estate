// import { motion } from "framer-motion";
// import { Sofa, Car, BadgePercent } from "lucide-react";

// const FEATURE_MAP = {
//   furnished: { label: "مفروشة بالكامل", icon: Sofa },
//   parking: { label: "موقف سيارات متاح", icon: Car },
//   offer: { label: "عرض وخصم خاص", icon: BadgePercent },
// };

// const container = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.05 } },
// };

// const item = {
//   hidden: { opacity: 0, scale: 0.9 },
//   show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
// };

// export default function ListingFeatures({ listing = {} }) {
//   const active = Object.entries(FEATURE_MAP).filter(([key]) => listing[key]);

//   if (!active.length) return null;

//   return (
//     <div className="border-t border-slate-100 pt-8">
//       <h2 className="text-xl font-bold text-slate-900 mb-4">المميزات</h2>
//       <motion.div
//         variants={container}
//         initial="hidden"
//         whileInView="show"
//         viewport={{ once: true, amount: 0.3 }}
//         className="flex flex-wrap gap-2.5"
//       >
//         {active.map(([key, { label, icon: Icon }]) => (
//           <motion.span
//             key={key}
//             variants={item}
//             className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-full transition-colors"
//           >
//             <Icon className="w-4 h-4" strokeWidth={1.75} />
//             {label}
//           </motion.span>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

import { motion } from "framer-motion";
import { Sofa, Car, BadgePercent } from "lucide-react";

const FEATURE_MAP = {
  furnished: { label: "مفروشة بالكامل", icon: Sofa },
  parking: { label: "موقف سيارات متاح", icon: Car },
  offer: { label: "عرض وخصم خاص", icon: BadgePercent },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
};

export default function ListingFeatures({ listing = {} }) {
  const active = Object.entries(FEATURE_MAP).filter(([key]) => listing[key]);

  if (!active.length) return null;

  return (
    <div className="border-t border-[#e7e2d7] pt-8">
      <h2 className="mb-4 text-xl font-black text-[#183d37]">المميزات</h2>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-wrap gap-2.5"
      >
        {active.map(([key, { label, icon: Icon }]) => (
          <motion.span
            key={key}
            variants={item}
            className="flex items-center gap-2 rounded-full bg-[#183d37]/5 px-4 py-2.5 text-sm font-bold text-[#183d37] transition-colors hover:bg-[#e49263]/15 hover:text-[#a3601f]"
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
