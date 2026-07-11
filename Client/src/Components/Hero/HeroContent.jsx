import { motion } from "framer-motion";
import HeroSearch from "./HeroSearch";
import HeroStats from "./HeroStats";
import HeroTrust from "./HeroTrust";
import HeroButtons from "./HeroButtons";

const HeroContent = () => {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="space-y-8"
    >
      {/* Headline */}
      <div className="space-y-4">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl lg:text-6xl font-bold leading-tight"
        >
          <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Premium
          </span>
          <br />
          <span className="text-slate-800">Real Estate Excellence</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg text-slate-600 leading-relaxed max-w-lg"
        >
          Experience the future of luxury property discovery. Powered by
          advanced AI and trusted by premium agencies worldwide.
        </motion.p>
      </div>

      {/* CTA Buttons */}
      <HeroButtons />

      {/* Smart Search */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <HeroSearch />
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <HeroTrust />
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <HeroStats />
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
