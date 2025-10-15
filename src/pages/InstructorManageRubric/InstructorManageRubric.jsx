import React, { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';

const InstructorManageRubric = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    {
      title: 'Chuẩn học thuật',
      subtitle: '8 tiêu chí đánh giá',
      tag: 'Software Engineer',
      tagColor: 'bg-blue-100 text-blue-600',
      criteria: [
        'Kiến thức chuyên môn',
        'Kỹ năng thực hành',
        'Tư duy phân biện',
        'Giao tiếp và trình bày'
      ]
    },
    {
      title: 'Thiết kế UI/UX',
      subtitle: '12 tiêu chí đánh giá',
      tag: 'Graphic Design',
      tagColor: 'bg-blue-100 text-blue-600',
      criteria: [
        'Nguyên lý thiết kế',
        'Tính thẩm mỹ',
        'Trải nghiệm người dùng',
        'Tính tương tác'
      ]
    },
    {
      title: 'Lập trình',
      subtitle: '10 tiêu chí đánh giá',
      tag: 'Software Engineer',
      tagColor: 'bg-blue-100 text-blue-600',
      criteria: [
        'Logic và thuật toán',
        'Chất lượng code',
        'Kiểm thử và debug',
        'Documentation'
      ]
    },
    {
      title: 'Kỹ năng mềm',
      subtitle: '6 tiêu chí đánh giá',
      tag: 'Soft Skills',
      tagColor: 'bg-purple-100 text-purple-600',
      criteria: [
        'Làm việc nhóm',
        'Giao tiếp hiệu quả',
        'Tư duy sáng tạo',
        'Lãnh đạo'
      ]
    }
  ];

  const rubrics = [
    {
      title: 'Web Development Final Project',
      description: 'Comprehensive assessment rubric',
      template: 'Academic Standard',
      templateColor: 'bg-blue-100 text-blue-600',
      totalCriteria: 8,
      createdDate: 'Dec 15, 2023'
    },
    {
      title: 'Database Design Assessment',
      description: 'Focus on database modeling and queries',
      template: '',
      templateColor: '',
      totalCriteria: 5,
      createdDate: 'Dec 12, 2023'
    },
    {
      title: 'Mobile App UI/UX Evaluation',
      description: 'User interface and experience assessment',
      template: 'Design Focused',
      templateColor: 'bg-blue-100 text-blue-600',
      totalCriteria: 12,
      createdDate: 'Dec 10, 2023'
    },
    {
      title: 'Python Programming Quiz',
      description: 'Basic programming concepts evaluation',
      template: '',
      templateColor: '',
      totalCriteria: 6,
      createdDate: 'Dec 8, 2023'
    },
    {
      title: 'Team Collaboration Assessment',
      description: 'Evaluate teamwork and communication skills',
      template: 'Soft Skills',
      templateColor: 'bg-purple-100 text-purple-600',
      totalCriteria: 4,
      createdDate: 'Dec 5, 2023'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Rubric đánh giá</h1>
          <p className="text-gray-600">Tạo và quản lý các rubric đánh giá cho môn học</p>
        </div>

        {/* Search and Create Button */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm rubric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Tạo Rubric
          </button>
        </div>

        {/* Template Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Rubric có sẵn</h2>
          <p className="text-gray-600 mb-6">Chọn template phù hợp để tạo rubric nhanh chóng</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{template.title}</h3>
                  <p className="text-sm text-gray-500">{template.subtitle}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${template.tagColor}`}>
                  {template.tag}
                </span>
                <ul className="space-y-2">
                  {template.criteria.map((criterion, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* My Rubrics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rubric của tôi</h2>
          <p className="text-gray-600 mb-6">Các rubric đã tạo và đang sử dụng</p>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Criteria Template</div>
              <div className="col-span-2">Total Criteria</div>
              <div className="col-span-2">Created Date</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Table Rows */}
            {rubrics.map((rubric, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
                <div className="col-span-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{rubric.title}</h3>
                  <p className="text-sm text-gray-500">{rubric.description}</p>
                </div>
                <div className="col-span-2">
                  {rubric.template && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${rubric.templateColor}`}>
                      {rubric.template}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="text-2xl text-base text-gray-900">{rubric.totalCriteria}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">{rubric.createdDate}</span>
                </div>
                <div className="col-span-2 flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorManageRubric;