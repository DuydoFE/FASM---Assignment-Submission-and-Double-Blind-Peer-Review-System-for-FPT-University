import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, ListChecks, Upload, GraduationCap, Users,
  Eye, BarChart, MessageSquare, Shield, Award, FileText,
  CheckCircle, Star, Clock, ArrowRight
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import BlurText from "@/components/BlurText";

import fasmLogo from "../../assets/img/FASM.png";

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeRole, setActiveRole] = useState("student");
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const smartFeatures = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Quickly find assignments, courses, and announcements.",
      gradient: "from-orange-500 to-red-500",
      link: "/Search",
    },
    {
      icon: ListChecks,
      title: "Assignment Management",
      description: "Keep track of all assignments, due dates, and instructions.",
      gradient: "from-purple-500 to-pink-500",
      link: "/my-assignments",
    },
    {
      icon: Upload,
      title: "Easy Submission",
      description: "Upload files, enter metadata, and tag with just a few clicks.",
      gradient: "from-green-500 to-emerald-500",
      link: "/my-assignments",
    },
  ];

  const roles = {
    student: {
      icon: GraduationCap,
      title: "For Students",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        {
          icon: Upload,
          title: "Easy Submission",
          description: "Submit assignments with just a few clicks. Upload files and track submission status in real-time.",
        },
        {
          icon: Eye,
          title: "Peer Review",
          description: "Review classmates' work anonymously and receive constructive feedback on your submissions.",
        },
        {
          icon: BarChart,
          title: "Track Progress",
          description: "Monitor your grades, view detailed feedback, and track your academic progress over time.",
        },
        {
          icon: MessageSquare,
          title: "AI Assistance",
          description: "Get AI-powered suggestions and instant feedback to improve your work quality.",
        },
        {
          icon: Shield,
          title: "Regrade Requests",
          description: "Request grade reviews if you believe your work deserves reconsideration.",
        },
        {
          icon: Award,
          title: "Achievement System",
          description: "Earn badges and recognition for quality submissions and helpful peer reviews.",
        },
      ],
    },
    instructor: {
      icon: Users,
      title: "For Instructors",
      gradient: "from-orange-500 to-red-500",
      features: [
        {
          icon: FileText,
          title: "Assignment Management",
          description: "Create, publish, and manage assignments with customizable rubrics and deadlines.",
        },
        {
          icon: CheckCircle,
          title: "Efficient Grading",
          description: "Grade submissions quickly with AI assistance and batch processing capabilities.",
        },
        {
          icon: BarChart,
          title: "Analytics Dashboard",
          description: "View detailed analytics on class performance, submission rates, and grade distribution.",
        },
        {
          icon: Star,
          title: "Rubric Builder",
          description: "Design flexible rubrics with weighted criteria for fair and consistent grading.",
        },
        {
          icon: Shield,
          title: "Plagiarism Detection",
          description: "Automatically detect potential plagiarism and ensure academic integrity.",
        },
        {
          icon: Clock,
          title: "Time Management",
          description: "Set deadlines, extensions, and manage late submissions efficiently.",
        },
      ],
    },
  };

  const currentRole = roles[activeRole];

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
              className="h-32 md:h-48 w-auto object-contain mb-8 drop-shadow-2xl"
              animate={{
                y: [0, -20, 0],
                filter: [
                  "drop-shadow(0 25px 25px rgba(59, 130, 246, 0.5))",
                  "drop-shadow(0 35px 35px rgba(139, 92, 246, 0.7))",
                  "drop-shadow(0 25px 25px rgba(59, 130, 246, 0.5))",
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
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <BlurText
                text="Fpt Assignment Submission & Management"
                className="text-2xl md:text-3xl font-bold text-white mb-6"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mb-4"
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Fair Assessments, Transparent Grading
            </motion.h2>
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
                to="/landing"
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

      {/* Smart Assignment Management Section */}
      <section className="relative py-20 bg-black/30 backdrop-blur-md border-y border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
                Smart Assignment Management
              </span>
            </motion.h2>
            <motion.p
              className="text-zinc-300 mt-2 text-lg mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              For FPT University
            </motion.p>
            <p className="text-xl text-zinc-300">
              Choose your role to explore tailored features
            </p>
          </motion.div>

          {/* Role Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {Object.entries(roles).map(([key, role]) => {
              const Icon = role.icon;
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveRole(key)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                    activeRole === key
                      ? `bg-gradient-to-r ${role.gradient} text-white shadow-lg scale-105`
                      : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-6 h-6" />
                  {role.title}
                </motion.button>
              );
            })}
          </div>

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            key={activeRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {currentRole.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white/5 rounded-xl p-6 shadow-lg border border-white/10 hover:shadow-2xl transition-all group backdrop-blur-sm"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${currentRole.gradient} mb-4`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-300 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className="mt-4 flex items-center text-sm font-medium text-blue-400"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;