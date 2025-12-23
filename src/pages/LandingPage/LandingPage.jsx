import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap,
  Users,
  FileText,
  CheckCircle,
  Star,
  BookOpen,
  Upload,
  Eye,
  BarChart,
  MessageSquare,
  Shield,
  Zap,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import fasmLogo from "../../assets/img/FASM.png";

const LandingPage = () => {
  const [activeRole, setActiveRole] = useState("student");
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const roles = {
    student: {
      icon: GraduationCap,
      title: "For Students",
      color: "blue",
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
      color: "orange",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-orange-500/20 to-green-500/20"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <motion.img
              src={fasmLogo}
              alt="FASM Logo"
              className="h-32 md:h-40 mx-auto mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Smart Assignment Management
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-orange-500 to-green-500 bg-clip-text text-transparent">
              For FPT University
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Streamline your academic workflow with our comprehensive platform designed
            for both students and instructors. Experience fair grading, peer review, and
            AI-powered assistance.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-500 transition-all"
            >
              Explore Features
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-2 bg-gray-600 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Role Selection Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Designed for Everyone
            </h2>
            <p className="text-xl text-gray-600">
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
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group"
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

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className="mt-4 flex items-center text-sm font-medium text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 text-blue-500" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose FASM?
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that make a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Process assignments and reviews at incredible speed with our optimized platform.",
                color: "yellow",
              },
              {
                icon: Shield,
                title: "Secure & Fair",
                description: "Double-blind peer review ensures unbiased evaluation and maintains academic integrity.",
                color: "green",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Leverage artificial intelligence for smart suggestions and automated assistance.",
                color: "purple",
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-xl text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${benefit.color}-100 mb-6`}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.4)",
                        "0 0 0 20px rgba(59, 130, 246, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className={`w-10 h-10 text-${benefit.color}-500`} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-orange-500 to-green-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>

          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of students and instructors already using FASM for
            better academic experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-lg font-bold text-lg hover:scale-105 transition-all shadow-2xl"
            >
              Start Now <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;