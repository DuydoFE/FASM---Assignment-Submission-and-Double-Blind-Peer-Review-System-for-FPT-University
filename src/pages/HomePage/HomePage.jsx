import React from "react";
import { Link } from "react-router-dom";
import { Search, ListChecks, Upload } from "lucide-react";
import ShinyText from "@/components/ShinyText";
import BlurText from "@/components/BlurText";
import SplitText from "@/components/SplitText";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const HomePage = () => {
  return (
    <div>
      <section className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <ShinyText
            text="FASM"
            disabled={false}
            speed={3}
            className="text-[8rem] md:text-[12rem] font-extrabold mb-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent leading-none"
          />

         
          <BlurText
            text="Fpt Assignment Submission & Management"
            className="text-2xl md:text-3xl font-bold text-zinc-300 mb-4"
          />
          

          <SplitText
            text="Fair Assessments, Transparent Grading"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />

        
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-black hover:bg-zinc-200 rounded-lg font-semibold transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 border border-white/20 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24 bg-black/30 backdrop-blur-md border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Outstanding Features
            </h2>
            <p className="text-zinc-400 mt-2 max-w-2xl mx-auto">
              Everything you need for a seamless assignment submission and
              grading process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-left shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
                <Search className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Smart Search
              </h3>
              <p className="text-zinc-400">
                Quickly find assignments, courses, and announcements.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-left shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
                <ListChecks className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Assignment Management
              </h3>
              <p className="text-zinc-400">
                Keep track of all assignments, due dates, and instructions.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-left shadow-lg hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
                <Upload className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Easy Submission
              </h3>
              <p className="text-zinc-400">
                Upload files, enter metadata, and tag with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;