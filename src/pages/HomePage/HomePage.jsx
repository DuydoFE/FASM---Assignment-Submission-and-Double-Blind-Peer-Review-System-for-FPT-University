import { Link } from "react-router-dom";
import { Search, ListChecks, Upload } from "lucide-react";

// Component Logo cho Footer
const FooterLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="bg-orange-500 p-2 rounded-md">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 4H20V18H4V4ZM6 8V16H18V8H6Z" fill="white" />
      </svg>
    </div>
    <span className="font-bold text-xl text-white">AssignmentHub</span>
  </div>
);

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="text-center py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Transparent marking
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-orange-500 text-white hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              Get started now
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Outstanding features
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full border-2 border-orange-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50">
                  <Search className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Smart search
              </h3>
              <p className="text-gray-600">
                Quickly find assignments, courses, and announcements with the
                smart AI search engine.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full border-2 border-orange-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50">
                  <ListChecks className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Assignment management
              </h3>
              <p className="text-gray-600">
                Keep track of all assignments, due dates, and detailed
                instructions in one easy-to-use interface.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full border-2 border-orange-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50">
                  <Upload className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Submitting your work is easy
              </h3>
              <p className="text-gray-600">
                Upload files, enter metadata, and tag with just a few clicks.
                Supports multiple file formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16">
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

      {/* Footer */}
    </div>
  );
};

export default HomePage;