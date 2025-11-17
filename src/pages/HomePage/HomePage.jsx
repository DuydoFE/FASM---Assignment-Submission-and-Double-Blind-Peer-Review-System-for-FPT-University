import React from "react";
import { Link } from "react-router-dom";
import { Search, ListChecks, Upload } from "lucide-react";

import Orb from "@/components/Orb";
import ShinyText from "@/components/ShinyText";
import BlurText from "@/components/BlurText"; 

const HomePage = () => {
  return (
    <div>
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Orb
            hue={240}
            hoverIntensity={0.5}
            rotateOnHover={true}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">

          <ShinyText
            text="FASM"
            speed={4}
            className="text-8xl md:text-9xl font-extrabold mb-2 text-white"
          />
          
          <BlurText
            text="Fair Assessments, Transparent Grading"
            className="text-2xl md:text-3xl font-bold text-gray-200 mb-10"
          />

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            The future of academic integrity through Blind Peer Reviews.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 border border-white/30 text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION (Giữ nguyên thiết kế) ===== */}
      <section className="relative py-16 lg:py-24 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Outstanding Features
            </h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
              Everything you need for a seamless assignment submission and grading process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Feature Card 1 */}
            <div className="bg-slate-900/50 rounded-lg border border-gray-700 p-8 text-left shadow-lg hover:border-gray-500 hover:bg-slate-900 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
                <Search className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Smart Search
              </h3>
              <p className="text-gray-400">
                Quickly find assignments, courses, and announcements.
              </p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-slate-900/50 rounded-lg border border-gray-700 p-8 text-left shadow-lg hover:border-gray-500 hover:bg-slate-900 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
                <ListChecks className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Assignment Management
              </h3>
              <p className="text-gray-400">
                Keep track of all assignments, due dates, and instructions.
              </p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-slate-900/50 rounded-lg border border-gray-700 p-8 text-left shadow-lg hover:border-gray-500 hover:bg-slate-900 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
                <Upload className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Easy Submission
              </h3>
              <p className="text-gray-400">
                Upload files, enter metadata, and tag with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION (Giữ nguyên) ===== */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16">
        {/* ... nội dung section stats không đổi ... */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-bold">10,000+</p>
              <p className="text-orange-100 mt-2">Students are using</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold">50,000+</p>
              <p className="text-orange-100 mt-2">Submitted assignments</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold">98%</p>
              <p className="text-orange-100 mt-2">Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold">24/7</p>
              <p className="text-orange-100 mt-2">Technical support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;