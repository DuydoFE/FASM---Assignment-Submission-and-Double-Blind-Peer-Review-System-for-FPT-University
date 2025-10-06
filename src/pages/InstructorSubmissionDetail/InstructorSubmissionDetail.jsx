import React from 'react';
import { ChevronLeft, ChevronRight, FileText, Eye, Download, Expand, Maximize2 } from 'lucide-react';

const InstructorSubmissionDetail = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Class List</span>
        <ChevronRight className="w-4 h-4" />
        <span>SE1819 - UI/UX Design</span>
        <ChevronRight className="w-4 h-4" />
        <span>Assignment 1</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Nguyen Van An</span>
      </nav>

      {/* Student Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            NA
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Nguyen Van An</h1>
            <p className="text-gray-500">Student ID: 2021001</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Submitted
            </span>
          </div>
          <p className="text-sm text-gray-800 font-medium">Submitted on: 23/12/2024 14:30</p>
          <p className="text-sm text-green-600">2 days before deadline</p>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Assignment 1: Wireframe Design</h2>
        <p className="text-gray-600">
          Design a wireframe for a mobile shopping application. Students need to create wireframes for 5 main screens of the application.
        </p>
      </div>

      {/* Submitted File */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Submitted File</h3>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">wireframe-design.fig</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📁 Size: 2.4 MB</span>
                  <span>🕒 Updated: 23/12/2024 14:28</span>
                  <span>🎨 Figma Design File</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wireframe Preview */}
      <div className="mb-8">
        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-20 mx-auto mb-4 border-2 border-gray-300 rounded-lg bg-white flex items-center justify-center">
              <div className="w-8 h-10 border border-gray-300 rounded"></div>
            </div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">Wireframe Preview</h4>
            <p className="text-sm text-gray-500 mb-6">5 design screens</p>
            
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Expand className="w-4 h-4" />
                Full Screen
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Maximize2 className="w-4 h-4" />
                Zoom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <ChevronLeft className="w-4 h-4" />
          Back to List
        </button>
        <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Grade
        </button>
      </div>
    </div>
  );
};

export default InstructorSubmissionDetail;