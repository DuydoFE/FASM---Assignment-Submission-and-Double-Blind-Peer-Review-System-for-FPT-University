import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ListChecks, Upload, Sparkles, TrendingUp, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import BlurText from "@/components/BlurText";
import SplitText from "@/components/SplitText";

import fasmLogo from "../../assets/img/FASM.png";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Quickly find assignments, courses, and announcements.",
      color: "orange",
      gradient: "from-orange-500 to-red-500",
      shadowColor: "orange-500/20",
      link: "/Search",
    },
    {
      icon: ListChecks,
      title: "Assignment Management",
      description: "Keep track of all assignments, due dates, and instructions.",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "purple-500/20",
      link: "/my-assignments",
    },
    {
      icon: Upload,
      title: "Easy Submission",
      description: "Upload files, enter metadata, and tag with just a few clicks.",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      shadowColor: "green-500/20",
      link: "/my-assignments",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background - FPT 3 colors */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 35%, #f5576c 50%, #ff9a56 65%, #feca57 75%, #48dbfb 85%, #0abde3 100%)",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            backgroundSize: ["200% 200%", "200% 200%", "200% 200%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-orange-500/80 to-green-500/80" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/20" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Mouse follower effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none -z-5 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center overflow-hidden relative">
        <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1,
            }}
          >
            <motion.img
              src={fasmLogo}
              alt="FASM Logo"
              className="h-48 md:h-80 w-auto object-contain mb-8 drop-shadow-2xl"
              animate={{
                y: [0, -20, 0],
                filter: [
                  "drop-shadow(0 25px 25px rgba(59, 130, 246, 0.3))",
                  "drop-shadow(0 35px 35px rgba(139, 92, 246, 0.5))",
                  "drop-shadow(0 25px 25px rgba(59, 130, 246, 0.3))",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <BlurText
              text="Fpt Assignment Submission & Management"
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mb-4"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-center bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
              Fair Assessments, Transparent Grading
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 hover:from-blue-600 hover:via-orange-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/50 hover:shadow-orange-500/50"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/features"
                className="inline-flex items-center px-8 py-3 border-2 border-white/30 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg font-semibold transition-all hover:border-white/50"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-2 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        className="relative py-16 lg:py-24 bg-black/30 backdrop-blur-md border-y border-white/10"
        style={{ y }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Outstanding Features
              </span>
            </motion.h2>
            <motion.p
              className="text-zinc-400 mt-2 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Everything you need for a seamless assignment submission and
              grading process.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Link to={feature.link} className="block group">
                  <motion.div
                    className={`relative bg-white/5 rounded-xl border border-white/10 p-8 text-left overflow-hidden`}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    {/* Animated border */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      style={{
                        background: `linear-gradient(45deg, transparent, ${feature.shadowColor}, transparent)`,
                        filter: "blur(20px)",
                      }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className={`inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient}`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </motion.div>

                      <h3 className="text-xl font-semibold text-zinc-100 mb-3 group-hover:text-white transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        {feature.description}
                      </p>

                      {/* Arrow indicator */}
                      <motion.div
                        className="mt-4 flex items-center text-sm font-medium text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        Explore
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;