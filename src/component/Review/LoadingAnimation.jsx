import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingAnimation = ({ message = "Finding Assignment..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Loader2 className="w-16 h-16 text-blue-600" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-xl text-gray-700 font-semibold"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default LoadingAnimation;