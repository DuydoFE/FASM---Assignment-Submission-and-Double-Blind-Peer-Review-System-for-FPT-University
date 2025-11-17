import React from "react";
import { Link } from "react-router-dom";
import { Search, ListChecks, Upload } from "lucide-react";
import FloatingLines from "@/components/FloatingLines";
import ShinyText from "@/components/ShinyText";
import BlurText from "@/components/BlurText";
const HomePage = () => {
return (
<div>
<section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">

    <div className="absolute top-0 left-0 w-full h-full z-0">
      <FloatingLines 
        enabledWaves={['top', 'middle', 'bottom']}
        lineCount={[10, 15, 20]}
        lineDistance={[8, 6, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
      />
    </div>

    <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
      <ShinyText
        text="FASM"
        disabled={false} 
        speed={3} 
        className="text-8xl md:text-9xl font-extrabold mb-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent" 
      />
      
      <BlurText
        text="Fair Assessments, Transparent Grading"
        className="text-2xl md:text-3xl font-bold text-zinc-800 mb-10"
      />

      <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-10">
        The future of academic integrity through Blind Peer Reviews.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/register"
          className="px-8 py-3 bg-orange-500 text-white hover:bg-orange-600 rounded-lg font-semibold transition-all"
        >
          Get Started Now
        </Link>
        <Link
          to="/features"
          className="px-8 py-3 border border-orange-300 text-orange-800 hover:bg-orange-100 rounded-lg font-semibold transition-all"
        >
          Learn More
        </Link>
      </div>
    </div>
  </section>
  <section className="relative py-16 lg:py-24 bg-white border-y border-orange-100">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900">
          Outstanding Features
        </h2>
        <p className="text-zinc-600 mt-2 max-w-2xl mx-auto">
          Everything you need for a seamless assignment submission and grading process.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        <div className="bg-orange-50 rounded-lg border border-orange-200 p-8 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
            <Search className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">Smart Search</h3>
          <p className="text-zinc-600">Quickly find assignments, courses, and announcements.</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg border border-orange-200 p-8 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
            <ListChecks className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">Assignment Management</h3>
          <p className="text-zinc-600">Keep track of all assignments, due dates, and instructions.</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg border border-orange-200 p-8 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-500/10">
            <Upload className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">Easy Submission</h3>
          <p className="text-zinc-600">Upload files, enter metadata, and tag with just a few clicks.</p>
        </div>
      </div>
    </div>
  </section>

</div>
);
};
export default HomePage;